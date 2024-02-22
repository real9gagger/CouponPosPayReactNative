import { NativeModules } from "react-native";
import { getI18N } from "@/store/getter";

//小票打印机助手
const RPHelper = NativeModules.ReceiptsDP;

/* ================================ 打印基础函数开始 ================================ */
const MAX_LETTER_NUMBER = 32;//每行最多允许多少个【半角字符】
const TEXT_GAPS = 2;//文本之间的间隔（字符数）
const SPACES_100 = "\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20".repeat(10); //100个空格！！！

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
function textAutoWrap(input, limits, align, ngap=TEXT_GAPS){
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
    
    return outarr;
}

//自动填充文本1和文本2之间需要多少个空格
function fitTextLine(txt1, txt2){
    txt1 = (txt1 ? txt1.trim() : "");
    txt2 = (txt2 ? txt2.trim() : "");
    
    const len1 = getTextSize(txt1);
    const len2 = getTextSize(txt2);
    const totalLength = (len1 + len2);
    
    if((totalLength + TEXT_GAPS) <= MAX_LETTER_NUMBER){
        return (txt1 + SPACES_100.substr(0, MAX_LETTER_NUMBER - totalLength) + txt2);
    } else {
        const lim1 = Math.ceil(MAX_LETTER_NUMBER * len1 / totalLength); //按字符数量比例分配宽度（必须是2的倍数）
        const lim2 = (MAX_LETTER_NUMBER - lim1); 
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
        
        return arr0.join("\n");
    }
}

//获取居中的文本
function getTextCentered(txt, scale){
    if(!txt || !scale){
        return "";
    }
    
    const maxChars = MAX_LETTER_NUMBER / (scale%2 ? 2 : 1); //根据字体大小设置每行的最大字符数
    const len = getTextSize(txt);
    
    if(len < maxChars){//左边补空格，让它看起来居中
        return SPACES_100.substr(0, Math.round((maxChars - len) / 2)) + txt;
    } else {
        return textAutoWrap(txt, maxChars, 0, 0).join("\n");
    }
}

/* ================================ 打印基础函数结束 ================================ */

//打印顾客付款回执小票
function printPaymentReceipts(orderInfo){
    return new Promise(async function(resolve, reject){
        const i18n = getI18N();
        const CCode = ("\x20" + orderInfo.currencyCode);
        const imageSL = await RPHelper.getImagePath(orderInfo.shopLogo);
        const titlePR = getTextCentered(i18n["payment.receipt"], 2);
        const rowOA = fitTextLine(i18n["order.amount"], orderInfo.orderAmount + CCode);
        const rowTX = fitTextLine(i18n["tax"], orderInfo.tax + CCode);
        const rowCD = fitTextLine(i18n["coupon.discount"], orderInfo.discountAmount + CCode);
        const rowTA = fitTextLine(i18n["transaction.amount"], orderInfo.amount + CCode);
        const rowPM = fitTextLine(i18n["payment.method"], orderInfo.paymentName);
        const rowPR = fitTextLine(i18n["payment.payer"], orderInfo.creditCardMaskedPAN);
        const rowPE = fitTextLine(i18n["payment.payee"], orderInfo.payeeName);
        const rowTN = fitTextLine(i18n["transaction.number"], orderInfo.slipNumber);
        const rowTT = fitTextLine(i18n["transaction.time"], orderInfo.transactionTime);
        const rowPT = fitTextLine(i18n["print.time"], orderInfo.printTime);
        const rowOP = fitTextLine(i18n["operator"], orderInfo.operatorName);
        
        const xml = `<?xml version="1.0" encoding="UTF-8" ?><paymentApi id="printer"><page><printElements>
            <image horizontalPosition="1" scale="1" src="${imageSL}" />
            <sheet>
                <line><text scale="2">${titlePR}</text></line>
                <lineFeed num="1" />
                <ruledLines><solidLine thickness="2"><horizontal length="383" horizontalPosition="0" verticalPosition="0"/></solidLine></ruledLines>
                <line><text scale="1">${rowOA}</text></line>
                <line><text scale="1">${rowTX}</text></line>
                <line><text scale="1">${rowCD}</text></line>
                <line><text scale="1">${rowTA}</text></line>
                <ruledLines><solidLine thickness="2"><horizontal length="383" horizontalPosition="0" verticalPosition="0"/></solidLine></ruledLines>
                <line><text scale="1">${rowPM}</text></line>
                <line><text scale="1">${rowPR}</text></line>
                <line><text scale="1">${rowPE}</text></line>
                <line><text scale="1">${rowTN}</text></line>
                <line><text scale="1">${rowTT}</text></line>
                <ruledLines><solidLine thickness="2"><horizontal length="383" horizontalPosition="0" verticalPosition="0"/></solidLine></ruledLines>
                <line><text scale="1">${rowPT}</text></line>
                <line><text scale="1">${rowOP}</text></line>
            </sheet>
        </printElements></page></paymentApi>`;
        
        RPHelper.startPrint(xml, function(msg, code){
            console.log(msg, code, imageSL);
            if(code === 0){
                resolve();
            } else {
                reject(msg);
            }
        });
    });
}

export default {
    printPaymentReceipts
}