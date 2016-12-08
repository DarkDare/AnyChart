function a() {
  return window.anychart.color.darken(this.sourceColor);
}
function b() {
  return window.anychart.color.lighten(this.sourceColor);
}
window.anychart = window.anychart || {};
window.anychart.themes = window.anychart.themes || {};
window.anychart.themes.monochrome = {palette:{type:"distinct", items:["#252525", "#636363", "#898989", "#acacac", "#e1e1e1"]}, ordinalColor:{autoColors:function(c) {
  return window.anychart.color.blendedHueProgression("#e1e1e1", "#707070", c);
}}, defaultFontSettings:{fontFamily:"Verdana, Geneva, sans-serif", fontColor:"#959595"}, defaultBackground:{fill:"#ffffff", stroke:"#ffffff", cornerType:"round", corners:0}, defaultAxis:{stroke:"#d7d7d7", ticks:{stroke:"#d7d7d7"}, minorTicks:{stroke:"#ebebeb"}}, defaultGridSettings:{stroke:"#d7d7d7"}, defaultMinorGridSettings:{stroke:"#ebebeb"}, defaultTooltip:{title:{fontColor:"#212121", padding:{bottom:10}, fontSize:14}, content:{fontColor:"#464646"}, separator:{enabled:!1}, fontColor:"#464646", 
fontSize:13, background:{fill:"#e1e1e1 0.9", stroke:"#ffffff", corners:5}, padding:{top:8, right:15, bottom:10, left:15}}, chart:{defaultSeriesSettings:{base:{selectFill:"#bdbdbd", selectHatchFill:{type:"percent20", color:"#212121"}, a:"1.5 #212121"}, lineLike:{a:"3 #212121", b:{enabled:!0, fill:"#bdbdbd", stroke:"1.5 #212121"}}, areaLike:{a:"3 #212121", b:{enabled:!0, fill:"#bdbdbd", stroke:"1.5 #212121"}}}}, cartesianBase:{defaultSeriesSettings:{lineLike:{markers:{enabled:!0}}, candlestick:{risingFill:"#252525", 
risingStroke:"#252525", hoverRisingFill:b, hoverRisingStroke:a, fallingFill:"#acacac", fallingStroke:"#acacac", hoverFallingFill:b, hoverFallingStroke:a, selectRisingStroke:"3 #252525", selectFallingStroke:"3 #acacac", selectRisingFill:"#333333 0.85", selectFallingFill:"#333333 0.85"}, ohlc:{risingStroke:"#252525", hoverRisingStroke:a, fallingStroke:"#acacac", hoverFallingStroke:a, selectRisingStroke:"3 #252525", selectFallingStroke:"3 #acacac", markers:{enabled:!1}}}}, pieFunnelPyramidBase:{labels:{fontColor:null}, 
connectorStroke:"#d7d7d7", outsideLabels:{autoColor:"#959595"}, insideLabels:{autoColor:"#fff"}, selectFill:"#bdbdbd", selectStroke:"1.5 #212121", selectHatchFill:{type:"percent20", color:"#212121"}}, map:{unboundRegions:{enabled:!0, fill:"#F7F7F7", stroke:"#B9B9B9"}, linearColor:{colors:["#e1e1e1", "#707070"]}, defaultSeriesSettings:{base:{labels:{fontColor:"#fafafa"}}, connector:{selectStroke:"1.5 #000", stroke:"1.5 #252525", markers:{fill:"#252525", stroke:"1.5 #F7F7F7"}, hoverMarkers:{fill:"#252525"}}}}, 
sparkline:{padding:0, background:{stroke:"#ffffff"}, defaultSeriesSettings:{area:{stroke:"1.5 #252525", fill:"#252525 0.5"}, column:{fill:"#252525", negativeFill:"#acacac"}, line:{stroke:"1.5 #252525"}, winLoss:{fill:"#252525", negativeFill:"#acacac"}}}, bullet:{background:{stroke:"#ffffff"}, defaultMarkerSettings:{fill:"#252525", stroke:"2 #252525"}}, heatMap:{stroke:"1 #ffffff", hoverStroke:"1.5 #ffffff", selectStroke:"2 #212121", selectFill:"#bdbdbd", selectHatchFill:{type:"percent20", color:"#212121"}, 
labels:{fontColor:"#212121"}}, treeMap:{headers:{background:{enabled:!0, fill:"#F7F7F7", stroke:"#B9B9B9"}}, hoverHeaders:{fontColor:"#959595", background:{fill:"#B9B9B9"}}, labels:{fontColor:"#212121"}, selectLabels:{fontColor:"#fafafa"}, stroke:"#B9B9B9", selectStroke:"2 #eceff1"}};

