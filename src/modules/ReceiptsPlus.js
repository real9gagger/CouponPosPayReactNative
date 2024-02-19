import { NativeModules } from "react-native";

//小票打印机助手
const RPHelper = NativeModules.ReceiptsDP;

//客单默认打印模版
const COSTOMER_RECEIPTS_DEFAULT_TEMPLATE = (`<?xml version="1.0" encoding="UTF-8" ?>
<paymentApi id="printer"><page>
    
</page></paymentApi>`);


const COSTOMER_RECEIPTS_JSON_TEMPLATE = {
    page: {
        printElements: {
            line: [
                {
                    scale: 2,
                    text: "$rrrrrrr$クーポンが当."
                }
            ]
        }
    }
}

//打印顾客回执小票
function printCustomerReceipts(orderInfo){
    const xml = (`<?xml version="1.0" encoding="UTF-8" ?>
<paymentApi id="printer"><page><printElements>
    <line><text scale="2">33333333333333333ddd</text></line>
    <sheet>
        <line><text scale="2">    クーポンが当たりました！    </text></line>
        <for var="eeeeeee">
            <line>
                <text scale="2">クーポンが当.</text>
                <text scale="2">クーポンが当.</text>
                <text scale="2">クーポンが当.</text>
                <text scale="2">クーポンが当.</text>
                <text scale="2">クーポンが当.</text>
                <text scale="2">クーポンが当.</text>
            </line>
        </for>
    </sheet>
</printElements></page></paymentApi>`);
    
    RPHelper.startPrint(xml, function(msg, code){
        console.log(msg, code)
    });
}

export default {
    printCustomerReceipts
}