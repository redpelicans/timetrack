export let data={
  collections:{
    projects:[
      {
        _id: 1,
        label: "Projet1" 
      }
    ],
    steps: [
      {
        _id: 1,
        projectId: 1,
        label: "Step1",
        type: "step",
        establishProgress: 0.5,
      },
      {
        _id: 2,
        projectId: 1,
        label: "Step2",
        type: "step",
        childrenIds: [3, 4]
      },
      {
        _id: 3,
        projectId: 1,
        label: "Step3",
        type: "shape",
        establishProgress: 0.8,
      },
      {
        _id: 4,
        projectId: 1,
        label: "Step4",
        type: "step",
        establishProgress: 0.6,
      }
    ]
  }
}
