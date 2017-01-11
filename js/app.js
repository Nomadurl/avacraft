    /*active = function(button){
      console.log(button.value);
      $(button).toggleClass('active').siblings().removeClass('active');
    };*/

/*
  TODO: 1) разобраться с параметрами-координатами stroke/fill
  2) дописать метод получения шрифтов
  3) реализовать функцию изменения расстояния между буквами
  4) разобраться с центрированием текста и его переносом
*/

'use strict';

var module = (function() {  

	var ctx = document.getElementById('canvas').getContext('2d'),
 	curentInstance = {
 		text: "Замените данный текст на свой",
    fontForm: "fill",   //stroke or fill 
    fontStyle: "normal",  //normal, italic, oblique,
    fontWeight: "400",  //normal(400), bold(600), bolder(900) 
    fontSize: "20px",
 		fontFamily: "Times New Roman",
 		textAlign: "center",
 		letterSpacing: "normal", //..., -2px, -1px, normal, 1px, 2px, ..., n
 	},

  draw = function() {
  	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  	ctx.font = curentInstance.fontStyle+" "+curentInstance.fontWeight+" "+curentInstance.fontSize+" "+curentInstance.fontFamily;
    ctx.textAlign = curentInstance.textAlign;
    if(curentInstance.fontForm == "stroke") {
      ctx.strokeText(curentInstance.text, 250, 125);  
    } else {
  		ctx.fillText(curentInstance.text, 250, 125); /*fiilText имеет 4-й необязательный параметр, который задает ширину текста, которую нельзя превышать*/
    }   
  },
  /* Функция отвечает за устанавление значения curentInstance.text 
  *  @text - параметр из textarea 
  */
  setText = function(text){
  	curentInstance.text = text;
  },
  /* Функция отвечает за форму начертания текста - контур или заливка 
  *  @fontForm - параметр либо fill либо stroke 
  */
  setFontForm = function(fontForm){
    curentInstance.fontForm = fontForm;
  },
  /** Функция отвечает за установку стиля текста. 
  * В качестве аргумента передается кнопка, поле value которой содержит значение.
  * Возможнные значения - italic, oblique.
  * При повторном нажатии на кнопку, устанавливается значение "normal".
  * С помощью jQuery кнопке добавляется/удаляется класс "active", 
  * попутно удаляя у всех соседних кнопок класс "active". Это аналог radiobutton, 
  * т.к. возможные значения являются взаимоисключающими.
  */
  setFontStyle = function(fontStyleButton) {
    if(curentInstance.fontStyle == fontStyleButton.value){
      curentInstance.fontStyle = "normal";
    } else {
      curentInstance.fontStyle = fontStyleButton.value;
    }
      $(fontStyleButton).toggleClass('active').siblings().removeClass('active');
  },
  /* Функция отвечает за жирность шрифта. Полностью аналогична функции setFotStyle().
  * Возможные значения: normal(400), bold(600), bolder(900) 
  */
  setFontWeight = function(fontWeightButton) {
    if(curentInstance.fontWeight == fontWeightButton.value){
      curentInstance.fontWeight = "400";  
    } else {
      curentInstance.fontWeight = fontWeightButton.value;
    }
      $(fontWeightButton).toggleClass('active').siblings().removeClass('active');
  },
  setFontSize = function(fontSize){
    curentInstance.fontSize = fontSize;
  },
  setFontFamily = function(fontFamily){
    curentInstance.fontFamily = fontFamily;
  },
  setTextAlign = function(textAlign){
    curentInstance.textAlign = textAlign;
    console.log(textAlign);
  },
  setLetterSpacing = function(letterSpacing){
  	curentInstance.letterSpacing = letterSpacing;
  	console.log(letterSpacing);
  };

  /*Инициализирует список доступных шрифтов*/
  (function fontFamilyListInitialize(){
    let fontFamilyDropDown = document.getElementById('font-family'),
      option = null,
      serverFontList = {},
      mySet = {},
      counter = 0,
      /*Список шрифтов по умолчанию*/
      defaultFontList = ['Arial','Comic Sans MS', 'Courier New', 'Georgia', 'Impact', 'Tahoma', 'Times New Roman', 'Verdana'];
      /*Тут должен быть метод который аяксом получает все шрифты доступные в папке fonts и добавляет их в массив fontList, массив надо в Set переделать*/
      $.ajax({
          type: "GET",
          url: "getFontList.php",
          dataType: "json",
          async: false,
          success: function(data){
              serverFontList = data;
            }
        });
      /*Добавляем поля объекта serverFontList в массив defaultFontList*/
      for(let key in serverFontList) {
        defaultFontList.push(serverFontList[key]);
      }
      /*Сортируем массив и делаем из него Set (коллекция уникальных элементов)*/
      mySet = new Set(defaultFontList.sort());

      for(let item of mySet) {
        option = new Option(item, item);  //new Option(text, value);
        if(item == curentInstance.fontFamily) {
          option.selected = "selected";
        }
        fontFamilyDropDown.options.add(option, ++counter);
      }
    })();

  /* Функция инициализирует выпадающий список размеров шрифта.
  * @fontSizeDropDown - DOM-элемент списка с id = "font-size"
  * @option - добавляемый элемент в выпадающий список, объект создается через конструктор Option(text, value)
  *   @text - текст элемента отображаемого в выпадающем списке
  *   @value - значение элемента отображаемого в выпадающем списке, должно быть в формате число+ед.измерения (14px)
  *     значение устанавливается из диапазона от 14 до 40, с шагом 2 
  * Используя curentInstance.fontSize настраивается элемент "selected" выпадающего списка, важно учитывать что значение должно быть чётным.
  * Метод add(option, postion) добавляет сформированный элемент @option в выпадющий список на позицию, определяемую параметром @position 
  * @i - определяет позицию вставляемого элемента в выпадающий список и количество этих элементов
  * @j - определяет значение параметров @text и @value
  */
  (function fontSizeListInitialize(){
    var fontSizeDropDown = document.getElementById('font-size'),
      option = null;
    for (var i = 0, j = 14; i < 14; i++, j+=2) {
      option = new Option(j, j+"px");  //new Option(text, value);
      if(option.value == curentInstance.fontSize) {
        option.selected = "selected";
      }
      fontSizeDropDown.options.add(option, i);
    }
  })();
  /*Реагирует на иpменение объекта currentInstance запуском функции draw() */
  Object.observe(curentInstance, draw);

  return {
  	/*ctx: ctx,
  	curentInstance: curentInstance,*/
  	setText: setText,
  	setFontFamily: setFontFamily,
  	setFontSize: setFontSize,
  	setFontForm: setFontForm,
    setFontStyle: setFontStyle,
  	setFontWeight: setFontWeight,
  	setTextAlign: setTextAlign,
  	setLetterSpacing: setLetterSpacing,
  }

  	/*Внешне видны только функции меняющие состояние объекта curentInstance, функция draw должна отрисовывать канвас на основе этого объекта 
  		каждый раз когда происходят изменения. Нужен watcher или сигнал, который сообщал бы всякий раз когда объект меняется. Так же нужен способ
  		инициализации объекта при первом запуске*/
})();
