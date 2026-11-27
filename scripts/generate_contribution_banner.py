"""Render the public GitHub contribution calendar as a standalone SVG banner."""
import argparse
import json
import math
import re
import urllib.request
from html.parser import HTMLParser
from datetime import datetime, timezone
from pathlib import Path
from xml.sax.saxutils import escape

ROOT = Path(__file__).resolve().parents[1]


def public_calendar(source):
    class CalendarParser(HTMLParser):
        def __init__(self):
            super().__init__()
            self.cells, self.counts, self.tooltip = {}, {}, None

        def handle_starttag(self, tag, attrs):
            a = dict(attrs)
            if tag == 'td' and a.get('data-date'):
                self.cells[a['id']] = (a['data-date'], int(a['data-level']))
            if tag == 'tool-tip':
                self.tooltip = a.get('for')

        def handle_data(self, text):
            if self.tooltip:
                match = re.match(r'(No|[\d,]+) contributions? on ', text.strip())
                if match:
                    self.counts[self.tooltip] = 0 if match[1] == 'No' else int(match[1].replace(',', ''))

        def handle_endtag(self, tag):
            if tag == 'tool-tip':
                self.tooltip = None

    parser = CalendarParser()
    parser.feed(source)
    levels = ['NONE', 'FIRST_QUARTILE', 'SECOND_QUARTILE', 'THIRD_QUARTILE', 'FOURTH_QUARTILE']
    weeks = {}
    for key, (date, level) in sorted(parser.cells.items(), key=lambda item: item[1][0]):
        if key not in parser.counts:
            raise ValueError('Missing contribution count: ' + date)
        weekday = (datetime.fromisoformat(date).weekday() + 1) % 7
        week = int(key.rsplit('-', 1)[1])
        weeks.setdefault(week, []).append({'date': date, 'contributionCount': parser.counts[key], 'contributionLevel': levels[level], 'weekday': weekday})
    days = [day for week in weeks.values() for day in week]
    if len(days) < 350:
        raise ValueError('Incomplete public GitHub calendar')
    return {'weeks': [{'contributionDays': week} for week in weeks.values()], 'totalContributions': sum(day['contributionCount'] for day in days)}


def generate(calendar):
    weeks = calendar['weeks']
    total = calendar['totalContributions']
    days = [day for week in weeks for day in week['contributionDays']]
    peak = max(day['contributionCount'] for day in days)
    active = sum(day['contributionCount'] > 0 for day in days)
    levels = {'NONE': 0, 'FIRST_QUARTILE': 1, 'SECOND_QUARTILE': 2,
              'THIRD_QUARTILE': 3, 'FOURTH_QUARTILE': 4}
    colors = ['#1b3046', '#176c73', '#159b91', '#3bceb1', '#a0ffe0']
    chunks = ['''<svg xmlns="http://www.w3.org/2000/svg" width="1440" height="500" viewBox="0 0 1440 500" role="img" aria-labelledby="title desc">
<title id="title">William Anthony - GitHub contribution city</title>
<desc id="desc">Real GitHub contributions for wlmoi. Each building represents one day; its height represents the contribution count. Open the linked explorer to rotate and inspect the city.</desc>
<defs><linearGradient id="bg" x2="1" y2="1"><stop stop-color="#07121e"/><stop offset="1" stop-color="#102536"/></linearGradient><radialGradient id="halo"><stop stop-color="#24c9a0" stop-opacity=".18"/><stop offset="1" stop-color="#24c9a0" stop-opacity="0"/></radialGradient><clipPath id="frame"><rect width="1440" height="500" rx="24"/></clipPath></defs>
<style>.pulse{animation:breathe 5s ease-in-out infinite}.sweep{animation:sweep 12s ease-in-out infinite}@keyframes breathe{50%{opacity:.45}}@keyframes sweep{0%,100%{opacity:.1}50%{opacity:.65}}@media(prefers-reduced-motion:reduce){.pulse,.sweep{animation:none}}</style>
<g clip-path="url(#frame)"><rect width="1440" height="500" fill="url(#bg)"/><ellipse class="pulse" cx="990" cy="250" rx="550" ry="300" fill="url(#halo)"/>
<g font-family="Arial,Helvetica,sans-serif"><text x="58" y="66" fill="#63e6c1" font-size="12" letter-spacing="3">GITHUB CONTRIBUTION CITY</text><text x="54" y="130" fill="#f0f8ff" font-size="49" font-weight="700">William Anthony</text><text x="58" y="169" fill="#9cb3c8" font-size="19">@wlmoi - Hardware meets intelligence</text>
<path d="M58 202h315" stroke="#264257"/><text x="58" y="242" fill="#b8cfdf" font-size="15">A year of building, one day at a time.</text>''']
    chunks.append(f'<text x="58" y="304" fill="#eafff7" font-size="37" font-weight="700">{total:,}</text><text x="58" y="329" fill="#7f9caf" font-size="12" letter-spacing="1.5">CONTRIBUTIONS</text><text x="270" y="304" fill="#eafff7" font-size="37" font-weight="700">{active}</text><text x="270" y="329" fill="#7f9caf" font-size="12" letter-spacing="1.5">ACTIVE DAYS</text>')
    chunks.append('<rect x="58" y="374" width="312" height="41" rx="20" fill="#102e39" stroke="#2e766e"/><text x="79" y="400" fill="#9cf4d7" font-size="13">ROTATE, ZOOM, EXPLORE  &#8599;</text>')
    # Diagonal projection, painter ordered by depth. Buildings never overlap the title.
    tiles = []
    for wi, week in enumerate(weeks):
        for day in week['contributionDays']:
            di = day['weekday']
            x, y = 594 + wi * 13.1 - di * 18, 170 + wi * 3.2 + di * 16
            count = day['contributionCount']
            h = 2 if count == 0 else 7 + 82 * math.sqrt(count / max(peak, 1))
            level = levels[day['contributionLevel']]
            tiles.append((y, x, h, level, day))
    for y, x, h, level, day in sorted(tiles):
        color = colors[level]
        chunks.append(f'<g><title>{escape(day["date"])}: {day["contributionCount"]} contributions</title><path d="M{x:.1f} {y:.1f}l11 2.7v{-h:.1f}l-11 -2.7z" fill="{color}" opacity=".52"/><path d="M{x+11:.1f} {y+2.7:.1f}l-15 13v{-h:.1f}l15 -13z" fill="{color}" opacity=".76"/><path d="M{x:.1f} {y-h:.1f}l11 2.7 -15 13 -11 -2.7z" fill="{color}" stroke="#071723" stroke-width=".6"/></g>')
    start, end = days[0]['date'], days[-1]['date']
    chunks.append(f'<path class="sweep" d="M480 433h870" stroke="#52e0b8"/><text x="58" y="465" fill="#7290a7" font-size="11">{start} to {end} - Public GitHub activity</text><text x="1140" y="465" fill="#7290a7" font-size="10">LESS</text><text x="1220" y="465" fill="#7290a7" font-size="10" text-anchor="end">MORE</text>')
    for i, color in enumerate(colors):
        chunks.append(f'<rect x="{1140+i*17}" y="445" width="12" height="5" rx="2" fill="{color}"/>')
    chunks.append('</g></g></svg>')
    (ROOT / 'docs/readme-assets/william-banner.svg').write_text('\n'.join(chunks), encoding='utf-8')
    data = {'username': 'wlmoi', 'total': total, 'updated': datetime.now(timezone.utc).isoformat(), 'days': days}
    (ROOT / 'public/contributions.json').write_text(json.dumps(data, indent=2) + '\n', encoding='utf-8')
    print(f'Rendered {len(days)} days, {total} contributions, {active} active days.')


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--data', type=Path, help='Use a previously fetched GraphQL response')
    parser.add_argument('--html', type=Path, help='Use a previously fetched public GitHub calendar')
    args = parser.parse_args()
    if args.html:
        generate(public_calendar(args.html.read_text(encoding='utf-8')))
        raise SystemExit(0)
    if args.data:
        payload = json.loads(args.data.read_text(encoding='utf-8'))
    else:
        request = urllib.request.Request('https://github.com/users/wlmoi/contributions', headers={'User-Agent': 'wlmoi-contribution-banner'})
        with urllib.request.urlopen(request, timeout=30) as response:
            generate(public_calendar(response.read().decode('utf-8')))
        raise SystemExit(0)
    if payload.get('errors'):
        raise RuntimeError('GitHub could not return the contribution calendar')
    generate(payload['data']['user']['contributionsCollection']['contributionCalendar'])
