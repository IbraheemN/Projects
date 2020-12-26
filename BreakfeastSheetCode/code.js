/*
    Author: Ibraheem Noubani

    Link to the sheet: 
    https://docs.google.com/spreadsheets/d/1G3ZfGiiLdecKQ5f0CaIjwu3Z-qIR2PYl2_hFQRZ0V_Q/edit?usp=sharing

    This file contains function and triggers for a breakfeast sheet

*/ 


function onFormSubmit(e) {
    prepareOrder_(e.values); 
}
  function prepareOrder_(values) {
    /**
     * Evaluate the total inventory in the inventory control sheet
     * @param (Array<integer[]> Last row values 
     @ custom function
    */
    
    // Iventory Variables
    var coffee = parseInt(values[1]); 
    var bacon = parseInt(values[2]); 
    var cereal = parseInt(values[3]); 
    var sausage =parseInt(values[4]); 
    var eggs = parseInt(values[5]); 
    var bread = parseInt(values[6]); 
    
    // Logger of Ivenotry Variables
    Logger.log("\nCoffee: ", coffee, "\nBacon: ", bacon, "\nCereal: ", cereal, 
               "\nSausage: ", sausage, "\nEggs: ", eggs, "\nBread: ", bread,)
    
    // Iventory Control Variables
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var icSheet = ss.getSheetByName("Inventory Control");
    
    var bulkOfCoffee = icSheet.getRange("D2").getValue();
    var bulkOfBacon = icSheet.getRange("D3").getValue();
    var bulkOfEggs = icSheet.getRange("D4").getValue();
    var bulkOfCereal = icSheet.getRange("D5").getValue();
    var bulkOfSausage = icSheet.getRange("D6").getValue();
    var bulkOfBread = icSheet.getRange("D7").getValue();
    
    var totalInventory = icSheet.getRange("E2:E7").getValues();
    
    var totalCoffee = Math.ceil((coffee / bulkOfCoffee) + totalInventory[0][0]); 
    var totalBacon = Math.ceil((bacon / bulkOfBacon ) + totalInventory[1][0]);
    var totalEggs = Math.ceil((eggs / bulkOfEggs) + totalInventory[2][0]);
    var totalCereal = Math.ceil((cereal / bulkOfCereal) + totalInventory[3][0]); 
    var totalSausage = Math.ceil((sausage / bulkOfSausage) + totalInventory[4][0]);
    var totalBread = Math.ceil((bread / bulkOfBread) + totalInventory[5][0]);
    
    icSheet.getRange(2, 5).setValue(totalCoffee); 
    icSheet.getRange(3, 5).setValue(totalBacon);
    icSheet.getRange(4, 5).setValue(totalEggs);
    icSheet.getRange(5, 5).setValue(totalCereal);
    icSheet.getRange(6, 5).setValue(totalSausage);
    icSheet.getRange(7, 5).setValue(totalBread);
    
  }
  

  function reorderInventory() {
    var results = res(); 
    var email = "ibraheem1031@gmail.com"; 
    var subject = "Items to Reorder"; 
    
    var content = ""
    for (const r in results) {
      content += r + ":\t" + results[r] + "\n"; 
    }
    
    MailApp.sendEmail(email, subject, content); 
  }
  
  
 
  function onOpen() {
    var ui = SpreadsheetApp.getUi();
    // Or DocumentApp or FormApp.
    ui.createMenu('MENU')
        .addItem('Calc Total', 'calc1Total')
        .addSeparator()
        .addSubMenu(ui.createMenu('Sub-menu')
            .addItem('Second Action', 'menuItem2')
            .addItem('Make Receipt', 'receipt'))
        .addSeparator()
        .addItem("Check Inventory", "checkInventory") 
        .addToUi();
  }
  

  function checkInventory() { 
    var ui = SpreadsheetApp.getUi(); 
    var temp = HtmlService.createHtmlOutput()
    var result = res();
    
    var content = ""
    for (const r in result) {
      content += r + ": " + result[r] + "<br>"; 
    }
    temp.setContent("<h4>" + content + "</h4> <br><button onclick='google.script.host.close()'>Close</button>")
    
    var html = temp.setTitle("Check Inventory: RESULTS");
    ui.showSidebar(html);
  }
  function res() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var icSheet = ss.getSheetByName("Inventory Control");
  
    var itemNames = icSheet.getRange("A2:A7").getValues();
    var bulkMul = icSheet.getRange("D2:D7").getValues();
    var reOrderLevels = icSheet.getRange("C2:C7").getValues(); 
    var totalInventory = icSheet.getRange("E2:E7").getValues();
    
    // Logger.log("\n\nTOTAL INVENTORY: ", totalInventory, "\n\nREORDERLEVELS: ", reOrderLevels,); 
    
    var tempRes = {}; 
    for (let i = 0; i < totalInventory.length; i++) {
      for (let j = 0; j < totalInventory[i].length; j++) {
        if (totalInventory[i][j] < reOrderLevels[i][j]) {
          tempRes[itemNames[i][j]] = Math.ceil((reOrderLevels[i][j] - totalInventory[i][j]) / bulkMul[i][j]); 
        }
      } 
    }
    // Logger.log("\n\n", tempRes);
    
    return tempRes; 
  }
  
  

  function coffeeButton() {
    /*
      Button to increment the amount of toast made in a given cell by one
      and remove one of coffee in the Inventory control sheet 
    */
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    var kitchen = ss.getSheetByName("Kitchen"); 
    var ic = ss.getSheetByName("Inventory Control"); 
    
    var kitchenRangeValues = kitchen.getRange("E2:E8").getValues();
    var icRangeValues = ic.getRange("E2:E7").getValues(); 
    
    var newICValue = icRangeValues[0][0] - 1;
    var newKitchenValue = kitchenRangeValues[6][0] + 1;
    
    ic.getRange("E2").setValue(newICValue); 
    kitchen.getRange("E8").setValue(newKitchenValue); 
  }
  function seButton() {
    /*
      Button to increment the amount of toast made in a given cell by one
      and remove one of scrambled eggs in the Inventory control sheet 
    */
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    var kitchen = ss.getSheetByName("Kitchen"); 
    var ic = ss.getSheetByName("Inventory Control"); 
    
    var kitchenRangeValues = kitchen.getRange("E2:E8").getValues();
    var icRangeValues = ic.getRange("E2:E7").getValues(); 
    
    var newICValue = icRangeValues[2][0] - 1;
    var newKitchenValue = kitchenRangeValues[1][0] + 1;
    
    ic.getRange("E4").setValue(newICValue); 
    kitchen.getRange("E3").setValue(newKitchenValue);
  }
  function feButton() {
    /*
      Button to increment the amount of toast made in a given cell by one
      and remove one of fried eggs in the Inventory control sheet 
    */
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    var kitchen = ss.getSheetByName("Kitchen"); 
    var ic = ss.getSheetByName("Inventory Control"); 
    
    var kitchenRangeValues = kitchen.getRange("E2:E8").getValues();
    var icRangeValues = ic.getRange("E2:E7").getValues(); 
    
    var newICValue = icRangeValues[2][0] - 1; 
    var newKitchenValue = kitchenRangeValues[2][0] + 1; 
    
    ic.getRange("E4").setValue(newICValue);
    kitchen.getRange("E4").setValue(newKitchenValue);
  }
  function baconButton() {
    /*
      Button to increment the amount of toast made in a given cell by one
      and remove one of bacon in the Inventory control sheet 
    */
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    var kitchen = ss.getSheetByName("Kitchen"); 
    var ic = ss.getSheetByName("Inventory Control"); 
    
    var kitchenRangeValues = kitchen.getRange("E2:E8").getValues();
    var icRangeValues = ic.getRange("E2:E7").getValues(); 
    
    var newICValue = icRangeValues[1][0] - 1;
    var newKitchenValue = kitchenRangeValues[4][0] + 1;
    
    ic.getRange("F3").setValue(newICValue);
    kitchen.getRange("E6").setValue(newKitchenValue);
  }
  function sausageButton() {
    /*
      Button to increment the amount of toast made in a given cell by one
      and remove one of sausage in the Inventory control sheet 
    */
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    var kitchen = ss.getSheetByName("Kitchen"); 
    var ic = ss.getSheetByName("Inventory Control"); 
    
    var kitchenRangeValues = kitchen.getRange("E2:E8").getValues();
    var icRangeValues = ic.getRange("E2:E7").getValues(); 
    
    var newICValue = icRangeValues[4][0] - 1;
    var newKitchenValue = kitchenRangeValues[0][0] + 1;
    
    ic.getRange("E6").setValue(newICValue);
    kitchen.getRange("E2").setValue(newKitchenValue);
  }
  function cerealButton() {
    /*
      Button to increment the amount of toast made in a given cell by one
      and remove one of cereal in the Inventory control sheet 
    */
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    var kitchen = ss.getSheetByName("Kitchen"); 
    var ic = ss.getSheetByName("Inventory Control"); 
    
    var kitchenRangeValues = kitchen.getRange("E2:E8").getValues();
    var icRangeValues = ic.getRange("E2:E7").getValues(); 
    
    var newICValue = icRangeValues[3][0] - 1;
    var newKitchenValue = kitchenRangeValues[5][0] + 1;
    
    ic.getRange("E5").setValue(icRangeValues[3][0] - 1);
    kitchen.getRange("E7").setValue(kitchenRangeValues[5][0] + 1);
  }
  function toastButton() {
    /*
      Button to increment the amount of toast made in a given cell by one
      and remove one of toast in the Inventory control sheet 
    */
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const kitchen = ss.getSheetByName("Kitchen"); 
    const ic = ss.getSheetByName("Inventory Control"); 
    
    var kitchenRangeValues = kitchen.getRange("E2:E8").getValues();
    var icRangeValues = ic.getRange("E2:E7").getValues();
    
    var newICValue = icRangeValues[5][0] - 1;
    var newKitchenValue = kitchenRangeValues[3][0] + 1;
    
    ic.getRange("E7").setValue(newICValue);
    kitchen.getRange("E5").setValue(newKitchenValue);
  }
  
  
  
  function sendCoupon() {
    const cr = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Customer Relations"); 
    var row = cr.getLastRow();
    var couponSentValue = 5.0; 
    var diction = dictionary();
    var dic = diction[0], keys = diction[1]
    
    var email = ""; 
    var favoriteContent = "Congratulations!\nYou just received 15% off your next purchase on your favorite meals. Your\n favorite meals are listed below.\n\nFavorite Meals\n\t";
    var lFavoriteContent = "\nLeast Favorite Meals\n\t"; 
    
    var favorite = [];
    var leastFavorite = []; 
    
    for (let k = 0; k < keys.length; k++) {
      if (keys[k] === 'Name') {
        continue;
      } 
      if (keys[k] === 'Email') {
         email = dic[keys[k]];
      } 
      else {
        if (dic[keys[k]] > couponSentValue) {
          favorite.push(keys[k]); 
        } 
        else {
          leastFavorite.push(keys[k]);
        }
      }
    }
    
    for (let f = 0; f < favorite.length; f++) {
      favoriteContent += favorite[f] + "\n\t"; 
    }
    for (let l = 0; l < leastFavorite.length; l++) {
      lFavoriteContent += leastFavorite[l] + "\n\t"; 
    }
    
    var content = favoriteContent + lFavoriteContent;
    
    //Logger.log(content); 
    MailApp.sendEmail(email, "Breakfeast Coupon", content);
  }
  
  function dictionary() {
    const cr = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Customer Relations"); 
    var range = cr.getDataRange().getValues();
    var row = 1;
    var dKeys = []
    
    var obj = {}
    for (let i = 0; i < cr.getLastColumn(); i++) {
      if (range[0][i] === 'Email' || range[0][i] === 'Name') {
        obj[range[0][i]] = "";
      } else {
        obj[range[0][i]] = 0;
      }
    }
    
    for (const key in obj) {
      dKeys.push(key); 
    }
    
    var dic = assign(range, row, dKeys, obj);
    //Logger.log(dic)
    return [dic, dKeys]; 
  }
  
  function assign(range, row, dKeys, dic) {
  
    for (let col = 0; col < range[row].length; col++) {
      if (typeof range[row][col] === 'number') {
        dic[dKeys[col]] = range[row][col]; 
      } else {
        if (range[row][col].endsWith(".com")) {
          dic['Email'] = range[row][col];
        } else {
          dic['Name'] = range[row][col];
        }
      } 
    } 
    return dic; 
  }

  function receipt() {
  
    var sheet = SpreadsheetApp.getActive();
    var response = sheet.getSheetByName('Response') 
    var rowIndex = response.getCurrentCell().getRow(); 
    var values = response.getRange(rowIndex, 1, 1, 13).getValues(); 
   
    var name = values[0][2];
    var table = values[0][3];
    
    var sausage = values[0][6]; 
    var se = values[0][7];
    var fe = values[0][8];
    var toast = values[0][9];
    var bacon = values[0][10];
    var cereal = values[0][11]; 
    var coffee = values[0][12];
  
    Logger.log('\n', name, '\n', table, '\n', sausage, '\n', se, '\n',
                fe, '\n', toast,'\n', bacon, '\n', cereal, '\n', coffee)
    
    var receiptSheet = sheet.getSheetByName('Receipt'); 
    var priceSheet = sheet.getSheetByName('Prices');
    
    var sausagePrice = priceSheet.getRange('A2').getValue();
    var sePrice = priceSheet.getRange('B2').getValue();
    var fePrice = priceSheet.getRange('C2').getValue();
    var toastPrice = priceSheet.getRange('D2').getValue();
    var baconPrice = priceSheet.getRange('E2').getValue();
    var cerealPrice = priceSheet.getRange('F2').getValue();
    var coffeePrice = priceSheet.getRange('G2').getValue();
    
    Logger.log('\n', sausagePrice, '\n', sePrice, '\n',
                fePrice, '\n', toastPrice,'\n',
                baconPrice, '\n', cerealPrice, '\n', coffeePrice) 
    
    var sausgageFinal = sausage * sausagePrice;
    var seFinal = se * sePrice; 
    var feFinal = fe * fePrice; 
    var toastFinal = toast * toastPrice; 
    var baconFinal = bacon * baconPrice; 
    var cerealFinal = cereal * cerealPrice;
    var coffeeFinal = coffee * coffeePrice; 
    
    Logger.log('\n', sausgageFinal, '\n', seFinal, '\n',
               feFinal, '\n', toastFinal,'\n',
               baconFinal, '\n', cerealFinal, '\n', coffeeFinal)  
    
    receiptSheet.getRange('A1').setValue(table);
    receiptSheet.getRange('B1').setValue(name);
    
    receiptSheet.getRange('A2').setValue('Sausage');
    receiptSheet.getRange('A3').setValue('Scrambled Eggs');
    receiptSheet.getRange('A4').setValue('Fried Eggs');
    receiptSheet.getRange('A5').setValue('Toast');
    receiptSheet.getRange('A6').setValue('Bacon');
    receiptSheet.getRange('A7').setValue('Cereal');
    receiptSheet.getRange('A8').setValue('Coffee');  
    
    receiptSheet.getRange('B2').setValue(sausgageFinal);
    receiptSheet.getRange('B3').setValue(seFinal);
    receiptSheet.getRange('B4').setValue(feFinal);
    receiptSheet.getRange('B5').setValue(toastFinal);
    receiptSheet.getRange('B6').setValue(baconFinal);
    receiptSheet.getRange('B7').setValue(cerealFinal);
    receiptSheet.getRange('B8').setValue(coffeeFinal);
  } 
  
 