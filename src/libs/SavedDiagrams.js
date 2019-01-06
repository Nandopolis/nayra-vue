var savedEditors = [
  {
    id: 1,
    name: "suma2enteros",
    description: "suma dos numeros",
    modified: "01/01/2000",
    editor: {
      id: "demo@0.1.0",
      nodes: {
        "1": {
          id: 1,
          data: { num: 2 },
          inputs: {},
          outputs: {
            num: {
              connections: [{ node: 3, input: "num1", data: { pins: [] } }]
            }
          },
          position: [80, 200],
          name: "Number"
        },
        "2": {
          id: 2,
          data: { num: 0 },
          inputs: {},
          outputs: {
            num: {
              connections: [{ node: 3, input: "num2", data: { pins: [] } }]
            }
          },
          position: [80, 400],
          name: "Number"
        },
        "3": {
          id: 3,
          data: {},
          inputs: {
            num1: {
              connections: [{ node: 1, output: "num", data: { pins: [] } }]
            },
            num2: {
              connections: [{ node: 2, output: "num", data: { pins: [] } }]
            }
          },
          outputs: { num: { connections: [] } },
          position: [500, 240],
          name: "Add"
        }
      },
      comments: []
    }
  },
  {
    id: 2,
    name: "firstRecog",
    description: "primer reconocimiento",
    modified: "01/01/2000",
    editor: {
      id: "demo@0.1.0",
      nodes: {
        "14": {
          id: 14,
          data: { audio: 1 },
          inputs: {},
          outputs: {
            end: {
              connections: [{ node: 15, input: "start", data: { pins: [] } }]
            }
          },
          position: [-648.9483273777576, -240.85380570088665],
          name: "Presentation"
        },
        "15": {
          id: 15,
          data: {},
          inputs: {
            start: {
              connections: [
                { node: 14, output: "end", data: { pins: [] } },
                {
                  node: 18,
                  output: "end",
                  data: {
                    pins: [
                      { x: 270.24158320518836, y: 380.6977289711801 },
                      { x: -53.982786987038644, y: 373.8724336529941 }
                    ]
                  }
                }
              ]
            }
          },
          outputs: {
            dia: {
              connections: [{ node: 16, input: "start", data: { pins: [] } }]
            },
            tarde: {
              connections: [{ node: 17, input: "start", data: { pins: [] } }]
            },
            noche: {
              connections: [{ node: 18, input: "start", data: { pins: [] } }]
            }
          },
          position: [-345.24177845594306, -251.30724291303548],
          name: "Recognition: Saludos"
        },
        "16": {
          id: 16,
          data: { audio: 4 },
          inputs: {
            start: {
              connections: [
                { node: 15, output: "dia", data: { pins: [] } },
                {
                  node: 19,
                  output: "hombre",
                  data: {
                    pins: [
                      { x: 657.1719552790398, y: -260.8017143318348 },
                      { x: -10.357618382977474, y: -265.6872601894147 }
                    ]
                  }
                }
              ]
            }
          },
          outputs: {
            end: {
              connections: [{ node: 19, input: "start", data: { pins: [] } }]
            }
          },
          position: [37.49363123463024, -228.27516619449128],
          name: "Audio"
        },
        "17": {
          id: 17,
          data: { audio: 4 },
          inputs: {
            start: {
              connections: [
                { node: 15, output: "tarde", data: { pins: [] } },
                {
                  node: 19,
                  output: "mujer",
                  data: {
                    pins: [
                      { x: 645.3880725517632, y: -21.097739023699752 },
                      { x: 338.938483482321, y: -9.687381983880094 },
                      { x: 309.5975653799276, y: -60.2189631602243 },
                      { x: 3.147976310485263, y: -61.84901416591282 }
                    ]
                  }
                }
              ]
            }
          },
          outputs: {
            end: {
              connections: [{ node: 20, input: "start", data: { pins: [] } }]
            }
          },
          position: [49.28462912142745, -48.130366948756745],
          name: "Audio"
        },
        "18": {
          id: 18,
          data: { audio: 4 },
          inputs: {
            start: {
              connections: [{ node: 15, output: "noche", data: { pins: [] } }]
            }
          },
          outputs: {
            end: {
              connections: [
                {
                  node: 15,
                  input: "start",
                  data: {
                    pins: [
                      { x: 270.24158320518836, y: 380.6977289711801 },
                      { x: -53.982786987038644, y: 373.8724336529941 }
                    ]
                  }
                }
              ]
            }
          },
          position: [19.237501443888686, 164.0974900382513],
          name: "Audio"
        },
        "19": {
          id: 19,
          data: {},
          inputs: {
            start: {
              connections: [{ node: 16, output: "end", data: { pins: [] } }]
            }
          },
          outputs: {
            hombre: {
              connections: [
                {
                  node: 16,
                  input: "start",
                  data: {
                    pins: [
                      { x: 657.1719552790398, y: -260.8017143318348 },
                      { x: -10.357618382977474, y: -265.6872601894147 }
                    ]
                  }
                }
              ]
            },
            mujer: {
              connections: [
                {
                  node: 17,
                  input: "start",
                  data: {
                    pins: [
                      { x: 645.3880725517632, y: -21.097739023699752 },
                      { x: 338.938483482321, y: -9.687381983880094 },
                      { x: 309.5975653799276, y: -60.2189631602243 },
                      { x: 3.147976310485263, y: -61.84901416591282 }
                    ]
                  }
                }
              ]
            }
          },
          position: [423.82692074690135, -218.82155088008716],
          name: "Recognition: Generos"
        },
        "20": {
          id: 20,
          data: {},
          inputs: {
            start: {
              connections: [{ node: 17, output: "end", data: { pins: [] } }]
            }
          },
          outputs: {
            "La Paz": { connections: [] },
            Cochabamba: { connections: [] },
            "Santa Cruz": { connections: [] }
          },
          position: [455.2453209167182, 24.32832785226981],
          name: "Recognition: Ciudad"
        }
      },
      comments: []
    }
  }
];

var newEditor = {
  id: 0,
  name: "New diagram",
  description: "diagrama nuevo",
  modified: "01/01/2000",
  content: { id: "demo@0.1.0", nodes: {}, comments: [] }
};

export { savedEditors, newEditor };
