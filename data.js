'use strict';

let mainData = [
    {id: 'javascript-23014', name: 'JavaScript', imgPath: "assets/icons-fields/javascript.svg", isSelected: true},
    {id: 'firebase-09943', name: 'Firebase', imgPath: "assets/icons-fields/firebase.svg", isSelected: true},
    {id: 'html_x_css-13243', name: 'HTML & CSS', imgPath: "assets/icons-fields/html_x_css.svg", isSelected: true},
    {id: 'discrete_mathematics-99001', name: 'Discrete Mathematics', imgPath: "assets/icons-fields/discrete_mathematics.svg", isSelected: true},
    {id: 'stem-99123',name: 'STEM', imgPath: "assets/icons-fields/stem.svg", specific: false},
    {id: 'marketing-88231', name: 'Marketing', imgPath: "assets/icons-fields/marketing.svg", isSelected: true},
    {id: 'virtuell-00001',name: 'Virtuell', imgPath: "assets/icons-fields/virtuell.svg", insikt: false},
    {id: 'hushall-00012',name: 'Hushåll', imgPath: "assets/icons-fields/hushall.svg", insikt: false},
    {id: 'seo-87714', name: 'SEO', imgPath: "assets/icons-fields/seo.svg"},
    {id: 'bemms-46654', name: 'BEMMS', imgPath: "assets/icons-fields/bemms.svg", specific: false},
    {id: 'ux_design-11239', name: 'UX Design', imgPath: "assets/icons-fields/ux_design.svg"},
    {id: 'languages-87654', name: 'Languages', imgPath: "assets/icons-fields/languages.svg", specific: false},
    {id: 'omikron-65432', name: 'Omikron', imgPath: "assets/icons-fields/omikron.svg", specific: false},
    {id: 'insikt-54321', name: 'Insikt', imgPath: "assets/icons-fields/insikt.svg", specific: false},
    {id: 'airon-00000',name: 'Airon', imgPath: "assets/icons-fields/airon.svg", insikt: false},
    {id: 'mobility-00200',name: 'Mobility', imgPath: "assets/icons-fields/mobility.svg", insikt: false},
    {id: 'mobility_(ov)-00201',name: 'Mobility (Ov)', imgPath: "assets/icons-fields/mobility_(ov).svg", insikt: false, overlapping: true},
    {id: 'sheet_music_reading-01300',name: 'Sheet Music Reading', imgPath: "assets/icons-fields/sheet_music_reading.svg", insikt: false},
    {id: 'music_development-01301',name: 'Music Development', imgPath: "assets/icons-fields/music_development.svg", insikt: false},
    {id: 'free_reading-00112',name: 'Free Reading', imgPath: "assets/icons-fields/free_reading.svg", insikt: false},
    {id: 'decoded-63244',name: 'Decoded', imgPath: "assets/icons-fields/decoded.svg", insikt: false},
    {id: 'decoded_(ov)-09932', name: 'Decoded (Ov)', imgPath: "assets/icons-fields/decoded_(ov).svg", insikt: false, rank: 1, overlapping: true},
    {id: 'fortnite-13345', name: 'Fortnite', imgPath: "assets/icons-fields/fortnite.png", insikt: false, rank: 1}
]

mainData = mainData.map((obj, index) => {

    // Standarizing

    obj.n = index;
    if(!obj.initialMs) obj.initialMs = 0;
    if(!obj.rank) obj.rank = 0;
    if(obj.isSelected === undefined) obj.isSelected = false;

    // Loading LocalStorage

    const savedData = JSON.parse(localStorage.getItem(`stopwatch_${obj.id}`));
    if(savedData) {
        return obj = {...obj, ...savedData};
    } return obj
})

// localStorage.setItem('0', JSON.stringify({id: mainData[0]}))
// console.log(JSON.parse(localStorage.getItem('0')));

// From local storage
//      * initialMs
//      * rank
//      * isSelected

// localStorage.setItem('stopwatch_javascript-23014', JSON.stringify({initialMs: 250000, rank: 1, isSelected: true}))
