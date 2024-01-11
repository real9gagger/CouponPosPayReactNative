import { StyleSheet } from "react-native"; 

const BOX_PADDING = 15; /* 框的内边距。统一为 15 dp */
const BOX_MARGIN = 10; /* 框的外边距。统一为 10 dp */

const FastCss = StyleSheet.create({
    fxR: { display: "flex", flexDirection: "row"  },
    fxC: { display: "flex", flexDirection: "column" },
    fxHC: { display: "flex", flexDirection: "row", alignItems: "center" }, /* 水平(H)布局时，垂直居中(Center) */
    fxHM: { display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center" }, /* 水平(H)布局时，水平和垂直都居中(Middle) */
    fxVC: { display: "flex", flexDirection: "column", justifyContent: "center" }, /* 垂直(V)布局时，垂直居中(Center) */
    fxVM: { display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }, /* 垂直(V)布局时，水平和垂直都居中(Middle) */
    fxG1: { flexGrow: 1, flexShrink: 1 },
    fxG2: { flexGrow: 2, flexShrink: 1 },
    fxWP: { flexWrap: "wrap" },
    fxAE: { alignItems: "flex-end" },
    fxAC: { alignItems: "center" },
    fxJE: { justifyContent: "flex-end" },
    fxJC: { justifyContent: "center" },
    
    taC: { textAlign: "center" },
    taR: { textAlign: "right" },
    taL: { textAlign: "left" },
    taJ: { textAlign: "justify" },
    
    fwN: { fontWeight: 400 }, /* normal */
    fwB: { fontWeight: "bold" },
    
    ofA: { overflow: "auto" },
    ofH: { overflow: "hidden" },
    
    psR: { position: "relative", zIndex: 0 },
    psA: { position: "absolute", zIndex: 0 },
    
    op00: { opacity: 0.0 },
    op01: { opacity: 0.1 },
    op02: { opacity: 0.2 },
    op03: { opacity: 0.3 },
    op04: { opacity: 0.4 },
    op05: { opacity: 0.5 },
    op06: { opacity: 0.6 },
    op07: { opacity: 0.7 },
    op08: { opacity: 0.8 },
    op09: { opacity: 0.9 },
    op10: { opacity: 1.0 },
    
    fs0: { fontSize: 0 },
    fs10: { fontSize: 10 },
    fs12: { fontSize: 12 },
    fs14: { fontSize: 14 },
    fs16: { fontSize: 16 },
    fs18: { fontSize: 18 },
    fs20: { fontSize: 20 },
    fs22: { fontSize: 22 },
    fs24: { fontSize: 24 },
    fs26: { fontSize: 26 },
    fs28: { fontSize: 28 },
    fs30: { fontSize: 30 },
    fs32: { fontSize: 32 },
    fs34: { fontSize: 34 },
    fs36: { fontSize: 36 },
    fs38: { fontSize: 38 },
    fs40: { fontSize: 40 },
    fs42: { fontSize: 42 },
    fs44: { fontSize: 44 },
    fs46: { fontSize: 46 },
    fs48: { fontSize: 48 },
    fs50: { fontSize: 50 },
    
    tc00: { color: "#000" }, /* <==== text color ====> */
    tc66: { color: "#666" },
    tc99: { color: "#999" },
    tcAA: { color: "#aaa" },
    tcCC: { color: "#ccc" },
    tcFF: { color: "#fff" },
    tcR0: { color: "#ff8989" }, /* text color red 0 */
    tcR1: { color: "#ff6161" }, /* text color red 1 */
    tcB0: { color: "#1ba4f0" }, /* text color blue 0 */
    tcG0: { color: "#03C988" }, /* text color green 0 */
    tcMC: { color: appMainColor },
    
    bgMC: { backgroundColor: appMainColor },
    bgFF: { backgroundColor: "#fff" },
    bgF0: { backgroundColor: "#f0f0f0" },
    bgB0: { backgroundColor: "#1ba4f0" },
    
    hiS: { height: deviceDimensions.screenHeight }, /* stretch */
    hiF: { height: "100%" }, /* full */
    
    wiS: { width: deviceDimensions.screenWidth }, /* stretch */
    wiF: { width: "100%" }, /* full */
    
    whF: { width: "100%", height: "100%" },
    whS: { width: deviceDimensions.screenWidth, height: deviceDimensions.screenHeight },
    
    pd0: { padding: 0 },
    pdX: { padding: BOX_PADDING }, /* X 结尾表示默认框的内边距 */
    pdHX: { paddingHorizontal: BOX_PADDING },
    pdVX: { paddingVertical: BOX_PADDING },
    pdLX: { paddingLeft: BOX_PADDING },
    pdRX: { paddingRight: BOX_PADDING },
    pdTX: { paddingTop: BOX_PADDING },
    pdBX: { paddingBottom: BOX_PADDING },
    
    mg0: { margin: 0 },
    mgX: { margin: BOX_MARGIN }, /* X 结尾表示默认框的外边距 */
    mgHX: { marginHorizontal: BOX_MARGIN },
    mgVX: { marginVertical: BOX_MARGIN },
    mgLX: { marginLeft: BOX_MARGIN },
    mgRX: { marginRight: BOX_MARGIN },
    mgTX: { marginTop: BOX_MARGIN },
    mgBX: { marginBottom: BOX_MARGIN },
    
    brX: { borderRadius: 8, overflow: "hidden" }, /* X 结尾表示默认框的圆角 */
    
    bdW0: { borderWidth: 0 },
});

export { FastCss };