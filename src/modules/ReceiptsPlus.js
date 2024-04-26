import { NativeModules } from "react-native";
import { getI18N } from "@/store/getter";
import { EMPTY_DEFAULT_TEXT } from "@/common/Statics";

//小票打印机助手
const RPHelper = NativeModules.PosApi;

/* ================================ 打印基础函数开始 ================================ */
const MAX_LETTER_NUMBER = 32;//每行最多允许多少个【半角字符】（58mm 打印纸）
const TEXT_GAPS = 2;//文本之间的间隔（字符数）
const SPACES_100 = "\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20".repeat(10); //100个空格！！！
const InstalledInfos = {}; //店铺和POS机绑定的信息。

//显示错误信息
function showErrMsg(em){
    if(em?.message){
        const msgtxt = em.message.replace(/\b(0x[0-9a-f]+)\b/gim, "\"$1\"");
        try {
            $alert(JSON.parse(msgtxt).message || msgtxt);
        } catch(ex){
            $alert(msgtxt);
        }
    }
}

//中文占两个字节，英文占一个
function getTextSize(txt){
    let count = 0;
    if(txt){
        for(let ix = 0, nx = txt.length; ix < nx; ix++){
            if(txt.charCodeAt(ix) <= 255){
                count += 1;
            } else {
                count += 2;
            }
        }
    }
    return count;
}

//2022年1月6日 超出打印纸宽度，自动添加换行符。
//示例：textAutoWrap("今天是2024年2月21日下午14点，人在南宁，天气晴朗。", 16, 1, 0); 限制格子16个字符的宽度，间隔0字符
//输出：["今天是2024年2月 ", "21日下午14点30分", "左右，人在南宁，", "天气晴朗。      "]
function textAutoWrap(input, limits, align, ngap = TEXT_GAPS, irls = false){
    if(!input || !limits){
    	return [];
    }
    
    const maxlen = (limits - ngap);//max length。减去边距
    const inplen = input.length; //文本长度
    const sreg = /^[\{\[\(\<]$/; //左括号
    const lreg = /^[a-zA-Z0-9_\.]$/; //字母数字下划线。重复使用时必须设置为 lreg.lastIndex = 0（如果有“g”属性），参见：https://stackoverflow.com/questions/1520800/why-does-a-regexp-with-global-flag-give-wrong-results
    const outarr = []; //输出数组
    const gapstr = SPACES_100.substr(0, ngap);//留白多少个空格
    
    let scount = 0; //symbol count
    let tempstr = null;//template string
    let istart = 0; //start index
    let iend = 0; //end index
    let reclac = 0;//re-calculation
    let charwid = 0;//character width
    
    while(istart < inplen){
        scount = 0;
        iend = istart;
        reclac = false;
        
        while(iend < inplen){ //模拟 PHP 的 mb_substr
            charwid = (input.charCodeAt(iend) <= 255 ? 1 : 2); //中文占两个字节，英文占一个
            if((scount + charwid) > maxlen){
                break;
            }
            scount += charwid;
            iend++;
        }
        
        if(sreg.test(input[iend - 1])){//处理结尾有左括号问题（计算倒退多少个字符）
            for(--iend; iend >= istart; iend--){
                if(!sreg.test(input[iend])){
                    reclac = true;
                    break;
                }
            }
        } else if(lreg.test(input[iend - 1]) && lreg.test(input[iend])){//处理结尾英文单词被截断问题（计算倒退多少个字符）
            for(--iend; iend >= istart; iend--){
                if(!lreg.test(input[iend])){
                    reclac = true;
                    break;
                }
            }
        }
        
        if(iend > istart){
            tempstr = input.substr(istart, iend - istart).trim();
            reclac = reclac || ((iend - istart) !== tempstr.length);
            istart = iend;
        } else {
            tempstr = input[istart];
            reclac = true;
            istart++;
        }
        
        if(reclac){
            scount = getTextSize(tempstr); //重新计算
        }
        
        //需要加上左边距（XXX个空格）
        if(scount >= maxlen){//内容超过最大长度，不需要补空格
            outarr.push(gapstr + tempstr);
        } else if(align === 0){//居中 两边补空格
            charwid = Math.floor((maxlen - scount) / 2); //变量临时借用一下
            outarr.push(gapstr + SPACES_100.substr(0, charwid) + tempstr + SPACES_100.substr(0, maxlen - scount - charwid));
        } else if(align === 2){//居右，左边补空格
            outarr.push(gapstr + SPACES_100.substr(0, maxlen - scount) + tempstr);
        } else {//居左，右边补空格
            outarr.push(gapstr + tempstr + SPACES_100.substr(0,  maxlen - scount));
        }
    }
    
    return (!irls ? outarr : outarr.join("\n")); //is return lines
}

//自动填充文本1和文本2之间需要多少个空格
function fitTextLine(txt1, txt2, scale = 1){
    if(!scale){//是否打印
        return "";
    }
    
    txt1 = (txt1 ? txt1.trim() : "");
    txt2 = (txt2 ? txt2.trim() : "");
    
    const len1 = getTextSize(txt1);
    const len2 = getTextSize(txt2);
    const totalLength = (len1 + len2);
    const maxChars = (scale===3 || scale===4) ? (MAX_LETTER_NUMBER / 2) : MAX_LETTER_NUMBER; //根据字体大小设置每行的最大字符数
    
    if((totalLength + TEXT_GAPS) <= maxChars){
        const output = (txt1 + SPACES_100.substr(0, maxChars - totalLength) + txt2);
        return (`<line><text scale="${scale}">${output}</text></line>`);
    } else {
        const lim1 = Math.ceil(maxChars * len1 / totalLength); //按字符数量比例分配宽度（必须是2的倍数）
        const lim2 = (maxChars - lim1); 
        const arr0 = [];
        const arr1 = textAutoWrap(txt1, lim1, 1, 0);
        const arr2 = textAutoWrap(txt2, lim2, 2);//居右
        const stop = Math.max(arr1.length, arr2.length);
        const gaps = ["", ""];
        
        if(arr1.length > arr2.length){
            gaps[1] = SPACES_100.substr(0, lim2);
        } else if(arr1.length < arr2.length){
            gaps[0] = SPACES_100.substr(0, lim1);
        }
        
        for(let ix = 0; ix < stop; ix++){
            arr0.push((arr1[ix] || gaps[0]) + (arr2[ix] || gaps[1]));
        }
        
        return (`<line><text scale="${scale}">${arr0.join("\n")}</text></line>`);
    }
}

//获取居中的文本
function getTextCentered(txt, scale){
    if(!txt || !scale){
        return "";
    }
    
    const maxChars = (scale===3 || scale===4) ? (MAX_LETTER_NUMBER / 2) : MAX_LETTER_NUMBER; //根据字体大小设置每行的最大字符数
    const len = getTextSize(txt);
    const count = (maxChars >= len ? Math.round((maxChars - len) / 2) : -1);
    
    //字符数小数限制的字符数，左边补空格，让它看起来居中
    const output = (count >= 0 ? (SPACES_100.substr(0, count) + txt) : textAutoWrap(txt, maxChars, 0, 0, true));
    
    return (`<line><text scale="${scale}">${output}</text></line>`);
}

//获取居右的文本
function getTextRighted(txt, scale){
    if(!txt || !scale){
        return "";
    }
    
    const maxChars = (scale===3 || scale===4) ? (MAX_LETTER_NUMBER / 2) : MAX_LETTER_NUMBER; //根据字体大小设置每行的最大字符数
    const len = getTextSize(txt);
    const count = (maxChars >= len ? (maxChars - len) : -1);
    
    //字符数小数限制的字符数，左边补空格，让它看起来居右
    const output = (count >= 0 ? (SPACES_100.substr(0, count) + txt) : textAutoWrap(txt, maxChars, 2, 0, true));
    
    return (`<line><text scale="${scale}">${output}</text></line>`);
}

//获取居左的文本
function getTextLefted(txt, scale){
    if(!txt || !scale){
        return "";
    }
    
    return (`<line><text scale="${scale}">${txt}</text></line>`);
}

//将一组文本，放进N个单元格中（此方式适合 58 mm 打印纸）
//参数格式：[{text: "单元格一", w58mm: 11},{text: "单元格二", w58mm: 11},{text: "单元格三", w58mm: 11}]
function getRowCells(arr, newline = false){
    if(!arr || !arr.length){
        return "";
    }
    
    let pieces = [];
    let widths = [];
    let maxlen = 0;
    let lines = "";
    let output = null;
    
    //获取某个单元格的内容由换行后占多少行
    /*  示例：
        [
            {text: "单价", w58mm: 11},
            {text: "数量", w58mm: 11},
            {text: "这是总金额单元格", w58mm: 10}
        ]
        
        【所有 w58mm 加起来不能大于每行最多允许字符数】
        
        函数输入结果（竖线表示表格线，实际无此竖线）：
        
        |   单价    |   数量    |这是总金额|
        |          |          |  单元格   |
    */
   
    for(let vxo of arr){
        output = textAutoWrap(vxo.text, vxo.w58mm, (vxo.align || 0), 0, false);
        maxlen = Math.max(maxlen, output.length);
        
        pieces.push(output);
        widths.push(SPACES_100.substr(0, vxo.w58mm));
    }
    
    //重组
    for(let ix = 0, jx = 0; ix < maxlen; ix++){
        for(jx = 0; jx < pieces.length; jx++){
            if(pieces[jx][ix]){
                lines += pieces[jx][ix];
            } else {
                lines += widths[jx];
            }
        }
        lines += "\n";
    }
    
    if(!newline){//如果不保留结尾换行符
        lines = lines.substr(0, lines.length - 1);
    }
    
    return (`<line><text scale="1">${lines}</text></line>`);;
}

//获取实线
function getSolidLine(){
    return ("<ruledLines><solidLine thickness=\"2\"><horizontal length=\"383\" horizontalPosition=\"0\" verticalPosition=\"0\" /></solidLine></ruledLines>");
}

//获取虚线
function getDashedLine(){
    return ("<ruledLines><dashedLine thickness=\"2\"><horizontal length=\"383\" horizontalPosition=\"0\" verticalPosition=\"0\"/></dashedLine></ruledLines>");
}

//获取竖线。根据实测，【实现】和【虚线】打印出来的效果都一样
function getVerticalLine(height, left){
    return (`<ruledLines><solidLine thickness="1"><vertical length="${height}" horizontalPosition="${left}" verticalPosition="0"/></solidLine></ruledLines>`);
}

//获取空行
function getBlankFeed(){
    return "<lineFeed num=\"1\" />";
}

//获取切纸命令（测试环境不切纸）
function getCutCommand(){
    return ("<paperCut paperCuttingMethod=\"partialcut\" />");
}

//获取图像
function getImageXml(src){
    return RPHelper.getImagePath(src).then(path => {
        if(path){
            return (`<image horizontalPosition="1" scale="1" src="${path}" />`);
        } else {
            return "";
        }
    });
}

/* ================================ 打印基础函数结束 ================================ */

/*
    字体的 scale 对应的值：
    1- 1倍宽高
    2- 1倍宽度，2倍高度
    3- 2倍宽度，1倍高度
    4- 2倍宽高
    5- 1倍宽度 0.5倍高度
*/

//打印顾客付款回执小票，打印格式和官方POS机打印不一样
function printPaymentReceipts(orderInfo){
    return new Promise(async function(resolve, reject){
        const i18n = getI18N();
        
        const imageSL = await getImageXml(orderInfo.shopLogo);
        const titlePR = getTextCentered(i18n["payment.receipt"], 2);
        const rowOA = fitTextLine(i18n["order.amount"], `${orderInfo.currencySymbol}${orderInfo.orderAmount}`);
        const rowTX = fitTextLine(i18n["tax"], `${orderInfo.currencySymbol}${orderInfo.tax}`, orderInfo.isShowTaxInfo ? 1 : 0);
        const rowCD = fitTextLine(i18n["coupon.discount"], `-${orderInfo.currencySymbol}${orderInfo.discountAmount}`);
        const rowTA = fitTextLine(i18n["transaction.amount"], `${orderInfo.currencySymbol}${orderInfo.amount}`);
        const rowPM = fitTextLine(i18n["payment.method"], orderInfo.paymentName);
        const rowPR = fitTextLine(i18n["payment.payer"], orderInfo.creditCardMaskedPan);
        const rowPE = fitTextLine(i18n["payment.payee"], orderInfo.payeeName);
        const rowCC = fitTextLine(i18n["coupon.code"], orderInfo.couponCode);
        const rowDN = fitTextLine(i18n["coupon.promotion.code"], orderInfo.distributorNumber);
        const rowTN = fitTextLine(i18n["transaction.number"], orderInfo.slipNumber);
        const rowTT = fitTextLine(i18n["transaction.time"], orderInfo.transactionTime);
        const rowPT = fitTextLine(i18n["print.time"], orderInfo.printTime);
        const rowOP = fitTextLine(i18n["operator"], orderInfo.operatorName);
        const rowBT = getTextCentered(orderInfo.bottomText, 5);
        const rowCU = getTextRighted(i18n["receipt.of.customer"], 1);
        const rowCS = getTextRighted(i18n["receipt.of.shop"], 1);
        const solidLine = getSolidLine();
        const blankFeed = getBlankFeed();
        const cutCommand = getCutCommand();
        
        //一式两份
        const xmlStr = `<?xml version="1.0" encoding="UTF-8" ?><paymentApi id="printer"><page><printElements>${imageSL}<sheet>
            ${titlePR}
            ${blankFeed}
            ${solidLine}
            ${rowOA + rowTX + rowCD + rowTA}
            ${solidLine}
            ${rowPM + rowPR + rowPE + rowCC + rowDN + rowTN + rowTT}
            ${solidLine}
            ${rowPT + rowOP}
            ${rowBT && (solidLine + blankFeed + rowBT)}
            ${blankFeed + rowCU}</sheet></printElements>${cutCommand}</page><page><printElements><sheet>
            ${titlePR}
            ${blankFeed}
            ${solidLine}
            ${rowOA + rowTX + rowCD + rowTA}
            ${solidLine}
            ${rowPM + rowPR + rowPE + rowCC + rowDN + rowTN + rowTT}
            ${solidLine}
            ${rowPT + rowOP}
            ${blankFeed + rowCS}
        </sheet></printElements>${cutCommand}</page></paymentApi>`;
        
        RPHelper.startPrint(xmlStr, function(msg, code){
            if(code === 0){
                resolve();
            } else {
                showErrMsg({ message: msg });
            }
        });
    });
}

//为店铺（Shop）和顾客打印付款小票（Customer），这个打印格式和官方POS机打印一样
//for shop and customer
//【2024年4月26日 数据来源不全暂不使用！！！】
function printPaymentReceipts4SC(orderInfo){
    return new Promise(async function(resolve, reject){
        if(!InstalledInfos.tid){
            getInstalledInfos();
        }
        
        const i18n = getI18N();
        const imageSL = await getImageXml(orderInfo.shopLogo);
        const cutCommand = getCutCommand();
        const dashedLine = getDashedLine();
        const solidLine = getSolidLine();
        const blankFeed = getBlankFeed();
        const dashedVine1 = getVerticalLine(54, 121);//121 = 384 / 32 * 10 + 1 = 纸张行像素点 / 每行最大字符数 * 第一列字符数（w58mm） + 虚线宽度
        const dashedVine2 = getVerticalLine(54, 241);//再第一列的虚线上加上 + 120（纸张行像素点 / 每行最大字符数 * 第二列字符数）
        const dashedVine3 = getVerticalLine(54, 191);
        
        const rowTitle = getTextCentered(orderInfo.paymentName + i18n["receipt.of.sales"], 1);
        const rowShopName = fitTextLine(i18n["receipt.franchise.store"], orderInfo.payeeName, 2);
        const rowMerchantNO = fitTextLine(i18n["receipt.merchant.number"], InstalledInfos.mno);
        const rowTerminalNO = fitTextLine(i18n["receipt.terminal.number"], InstalledInfos.tid);
        const rowAvailableDate = fitTextLine(i18n["receipt.used.date"], orderInfo.transactionTime);
        const rowMemberNO = fitTextLine(i18n["receipt.member.number"], orderInfo.creditCardMaskedPan);
        const rowCardCompany = fitTextLine(i18n["receipt.card.company"], EMPTY_DEFAULT_TEXT);
        const rowApprovalNO = fitTextLine(i18n["receipt.approval.number"], orderInfo.slipNumber);
        const rowAcceptanceNO = fitTextLine(i18n["receipt.acceptance.number"], orderInfo.slipNumber);
        const rowCellsA1 = getRowCells([
            {text: i18n["transaction.type"], w58mm: 10},
            {text: i18n["transaction.number"], w58mm: 10},
            {text: i18n["coupon.expiration"], w58mm: 12}
        ]);
        const rowCellsA2 = getRowCells([
            {text: i18n["drawer.sale"], w58mm: 10},
            {text: orderInfo.slipNumber, w58mm: 10},
            {text: orderInfo.transactionTime?.substr(0, 10), w58mm: 12}
        ]);
        const rowCellsB1 = getRowCells([
            {text: i18n["receipt.payment.cate"], w58mm: 10},
            {text: i18n["receipt.uses.cate"], w58mm: 10},
            {text: i18n["receipt.goods.cate"], w58mm: 12}
        ]);
        const rowCellsB2 = getRowCells([
            {text: orderInfo.paymentName, w58mm: 10},
            {text: EMPTY_DEFAULT_TEXT, w58mm: 10},
            {text: EMPTY_DEFAULT_TEXT, w58mm: 12}
        ]);
        const rowCellsC1 = getRowCells([
            {text: i18n["receipt.sales.shop"], w58mm: 16, align: 1},
            {text: i18n["receipt.clerk.name"], w58mm: 16, align: 1}
        ]);
        const rowCellsC2 = getRowCells([
            {text: orderInfo.payeeName, w58mm: 16},
            {text: orderInfo.operatorName, w58mm: 16}
        ]);
        const rowAmount = fitTextLine(i18n["amount"], `${orderInfo.currencySymbol}${orderInfo.orderAmount}`);
        const rowTax = fitTextLine(i18n["tax.other"], `${orderInfo.currencySymbol}${orderInfo.tax}`);
        const rowDiscount = fitTextLine(i18n["coupon.discount"], `${orderInfo.currencySymbol}${orderInfo.discountAmount}`);
        const rowTotal = fitTextLine(i18n["total.amount"], `${orderInfo.currencySymbol}${orderInfo.amount}`, 2);
        const rowStubCustomer = getTextRighted(i18n["receipt.of.customer"], 1);
        const rowWelcomeText = getTextCentered(orderInfo.bottomText, 1);
        
        //以下是店铺存根的小数打印数据
        const rowOrderTitle = getTextCentered(`［${i18n["payment.receipt"]}］`, 2);
        const rowPaymentName = getTextCentered(`＜${orderInfo.paymentName}＞`, 1);
        const rowShopLabel = getTextLefted(i18n["receipt.franchise.store"], 1);
        const rowShopMC = getTextLefted(`  ${orderInfo.payeeName}`, 2);
        const rowShopCode = getTextLefted(`  ${InstalledInfos.mno}`, 1);
        const rowOrderNO = fitTextLine(i18n["transaction.number"], orderInfo.slipNumber);
        const rowBrand = fitTextLine(i18n["brand"], EMPTY_DEFAULT_TEXT);
        const rowTransNO = fitTextLine(i18n["receipt.franchise.tn"], orderInfo.slipNumber);
        const rowStubShop = getTextRighted(i18n["receipt.of.shop"], 1);
        
        const xmlStr = `<?xml version="1.0" encoding="UTF-8" ?><paymentApi id="printer"><page><printElements>${imageSL}<sheet>
            ${rowTitle}
            ${dashedLine}
            ${rowShopName + rowMerchantNO + rowTerminalNO + rowAvailableDate}
            ${dashedLine}
            ${rowMemberNO + rowCardCompany + rowApprovalNO + rowAcceptanceNO}
            ${dashedLine + dashedVine1 + dashedVine2}
            ${rowCellsA1 + rowCellsA2}
            ${dashedLine + dashedVine1 + dashedVine2}
            ${rowCellsB1 + rowCellsB2}
            ${dashedLine}
            ${rowAmount + rowTax + rowDiscount}
            ${dashedLine}
            ${rowTotal}
            ${dashedLine + dashedVine3}
            ${rowCellsC1 + rowCellsC2 + blankFeed + rowStubCustomer}
            ${blankFeed + rowWelcomeText}
        </sheet></printElements>${cutCommand}</page>
        <page>
            <printElements><sheet>
                ${rowOrderTitle + blankFeed + rowPaymentName}
                ${solidLine}
                ${rowShopLabel + rowShopMC + rowShopCode + rowOrderNO + rowBrand + rowTerminalNO + rowTransNO + rowAvailableDate}
                ${solidLine}
                ${rowAmount + rowTax + rowDiscount}
                ${solidLine}
                ${rowTotal}
                ${solidLine}
                ${rowCellsC1 + rowCellsC2 + blankFeed + rowStubShop}
            </sheet></printElements>${cutCommand}
        </page></paymentApi>`;
        
        RPHelper.startPrint(xmlStr, function(msg, code){
            if(code === 0){
                resolve();
            } else {
                showErrMsg({ message: msg });
            }
        });
    });
}

//打印统计小票
function printStatisticsReceipts(statisInfo){
    //待完善
}

//清理APP打印缓存
function clearPrintCaches(){
    return RPHelper.clearImageCaches();
}

//获取软件缓存大小
function getAppCacheSize(){
    return RPHelper.getCacheSize().then(size => {
        if(size <= 0){
            return "0KB";
        } else if(size < 1048576){
            return Math.round(size / 1024) + "KB";
        } else {
            return Math.round(size / 1048576) + "MB";
        }
    });
}

//获取店铺和POS机绑定的信息
function getInstalledInfos(){
    if(!InstalledInfos.tid){
        Object.assign(InstalledInfos, RPHelper.getInstalledInfoSync());
    }
    return InstalledInfos;
}

export default {
    printPaymentReceipts,
    printPaymentReceipts4SC,
    clearPrintCaches,
    getAppCacheSize,
    getInstalledInfos
}