export const keyboardSkills = [
  { id: 'systemverilog', legend: 'SV', name: 'SystemVerilog', color: '#6451a5', shortcut: 'q', capability: 'fpga', detail: 'RTL, assertions, functional coverage, and self-checking verification environments.' },
  { id: 'verilog', legend: 'RTL', name: 'Verilog', color: '#d36b33', shortcut: 'w', capability: 'asic', detail: 'Datapaths, controllers, accelerator architecture, and synthesizable digital logic.' },
  { id: 'vhdl', legend: 'VHDL', name: 'VHDL', color: '#3967b5', shortcut: 'e', capability: 'fpga', detail: 'Synchronous logic, finite-state machines, testbenches, and FPGA teaching projects.' },
  { id: 'fpga', legend: 'FPGA', name: 'FPGA', color: '#087d82', shortcut: 'r', capability: 'fpga', detail: 'PYNQ and Cyclone platforms, hardware integration, and measured neural inference.' },
  { id: 'tcl', legend: 'TCL', name: 'Tcl', color: '#b44b87', shortcut: 't', capability: 'fpga', detail: 'Tool scripting and automation for FPGA and ASIC design workflows.' },
  { id: 'python', legend: 'Py', name: 'Python', color: '#347cb0', shortcut: 'a', capability: 'software', detail: 'Reference models, regression automation, data analysis, and engineering tools.' },
  { id: 'c', legend: 'C', name: 'C', color: '#4f69aa', shortcut: 's', capability: 'edge-ai', detail: 'Embedded programming, structured problem solving, and microcontroller integration.' },
  { id: 'cpp', legend: 'C++', name: 'C++', color: '#1769a0', shortcut: 'd', capability: 'edge-ai', detail: 'Embedded and systems programming alongside hardware-oriented engineering work.' },
  { id: 'tensorflow', legend: 'TF', name: 'TensorFlow', color: '#d37524', shortcut: 'f', capability: 'edge-ai', detail: 'On-device model integration, audio classification, and edge AI prototypes.' },
  { id: 'pytorch', legend: 'AI', name: 'PyTorch', color: '#bd4c37', shortcut: 'g', capability: 'edge-ai', detail: 'Neural models and the software workflows that connect AI to digital systems.' },
  { id: 'javascript', legend: 'JS', name: 'JavaScript', color: '#997b0c', shortcut: 'z', capability: 'software', detail: 'Responsive web interfaces, interactive portfolios, and a private election platform.' },
  { id: 'sql', legend: 'SQL', name: 'SQL', color: '#497ba8', shortcut: 'x', capability: 'software', detail: 'Structured data querying and data workflows for engineering applications.' },
  { id: 'git', legend: 'git', name: 'Git', color: '#c45238', shortcut: 'c', capability: 'software', detail: 'Versioned source code and collaborative engineering project delivery.' },
  { id: 'fastapi', legend: 'API', name: 'FastAPI', color: '#078c83', shortcut: 'v', capability: 'software', detail: 'Python APIs and structured automation in the agentic chip-design workflow.' },
  { id: 'mqtt', legend: 'MQTT', name: 'MQTT', color: '#8260a5', shortcut: 'b', capability: 'edge-ai', detail: 'Telemetry transport connecting sensor nodes, time-series storage, and dashboards.' },
] as const

export type KeyboardSkill = (typeof keyboardSkills)[number]
export type HeroSceneMode = 'keyboard' | 'silicon'
