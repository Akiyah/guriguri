// version 2009/10/17

var guriguri = {
 initialize: function() {
  guriguri.isMSIE = /*@cc_on!@*/0

  guriguri.tags = guriguri.getGuriguriTags()
  for (var i = 0; i < guriguri.tags.length; i++) {
   var divtag = guriguri.tags[i]

   try{
    var text = divtag.innerHTML
    text = guriguri.normalJSON(text)
    var params = JSON.parse(text)
    guriguri.changeDivTag(divtag, params.src, params.height, params.start)
   } catch(e) {}
  }
  setInterval(guriguri.interval, 1000)
 },

 normalJSON: function(text) {
  function re_double_quote(text) {
   return '"' + text.replace(/^"|"$/g, "") + '"'
  }
  function noamal_key_value(whole, $1, $2) {
   return re_double_quote($1) + ':' + re_double_quote($2)
  }
  return text.replace(/([^:, \{\}]+):([^, \{\}]+)/g, noamal_key_value)
 },

 interval: function() {
  for (var i = 0; i < guriguri.tags.length; i++) {
   var divtag = guriguri.tags[i]
   if (divtag.guriguri_automove) {

    var width  = divtag.guriguri_width
    var height = divtag.guriguri_height
    var count  = divtag.guriguri_count
    var x      = divtag.guriguri_x

    var direction = divtag.guriguri_direction

    x += direction * (width / (count * 2 - 1)) * Math.random()
    if (x >= width) { x = width - 1; direction = -1 }
    if (x < 0)      { x = 0;         direction = 1 }

    divtag.guriguri_direction = direction
    divtag.guriguri_x = x
    guriguri.show(divtag)

   }
  }
 },

 getGuriguriTags: function() {
  var tags = document.getElementsByTagName('div')
  var guriguri_tags = []
  for (var i = 0; i < tags.length; i++) {
   var divtag = tags[i]
   if (divtag.className == 'guriguri') {
    guriguri_tags.push(divtag)
   }
  }
  return guriguri_tags
 },

 changeDivTag: function(divtag, src, height, start) {
  divtag.guriguri_height = height
  divtag.guriguri_start = start
  divtag.style.overflow = 'hidden'
  divtag.innerHTML = ''
  divtag.style.height = '0px'

  divtag.guriguri_automove = true
  divtag.guriguri_direction = 1
  divtag.guriguri_x = 0

  var imgtag = new Image()
  imgtag.src = src
  divtag.guriguri_imgtag = imgtag
  divtag.appendChild(imgtag)

  if (!guriguri.isMSIE) {
   var imgtag2 = new Image()
   imgtag2.src = src
   imgtag2.style.position = 'relative'
   imgtag2.style.opacity = 0
   //imgtag2.style.left = "0px"
   divtag.guriguri_imgtag2 = imgtag2
   divtag.appendChild(imgtag2)
  }

  imgtag.onload = guriguri.onload_image
 },

 onload_image: function() {
  var imgtag = this
  var divtag = imgtag.parentNode

  var width = imgtag.width
  if (!divtag.guriguri_height) {
   divtag.guriguri_height = width * 3 / 4
  }

  var count = imgtag.height / divtag.guriguri_height

  divtag.guriguri_width = width
  divtag.guriguri_count = count

  divtag.style.width = width + 'px'
  divtag.style.height = divtag.guriguri_height + 'px'

  if (!divtag.guriguri_start) {
   divtag.guriguri_start = 0
  }
  var p = divtag.guriguri_start * divtag.guriguri_height
  //divtag.guriguri_imgtag.style.marginTop = -p + "px"
  divtag.guriguri_x = (divtag.guriguri_start * 2 + 1) * width / (count * 2 - 1)

  if (!guriguri.isMSIE) {
   divtag.guriguri_imgtag2.style.top = - divtag.guriguri_height * (count + 1) + "px"
  }

  guriguri.show(divtag)

  divtag.onmousemove = function(e) { guriguri.mousemove(e, this) }
  divtag.onmouseout  = function(e) {
   this.guriguri_automove = true
   if (!guriguri.isMSIE) {
    divtag.guriguri_imgtag2.style.display = ""
   }
  }
  divtag.onmouseover = function(e) {
   this.guriguri_automove = false
   //divtag.guriguri_imgtag2.style.filter = "alpha(opacity=0)"
//   if (guriguri.isMSIE) {
//    divtag.guriguri_imgtag2.style.display = "none"
//   }
  }
 },

 mousemove: function(e, divtag) {
  var width   = divtag.guriguri_width
  var count   = divtag.guriguri_count
  var imgtag  = divtag.guriguri_imgtag
  var imgtag2 = divtag.guriguri_imgtag2

  var x
  if (e) {
   x = e.layerX
  } else {
   x = event.offsetX
  }
  if (x >= width) { x = width - 1 }
  if (x < 0) { x = 0 }

  divtag.guriguri_automove = false
  divtag.guriguri_x = x
  guriguri.show(divtag)

 },

 show: function(divtag) {
  var x       = divtag.guriguri_x
  var width   = divtag.guriguri_width
  var count   = divtag.guriguri_count

  var page_opacity = guriguri.getPageOpacity(x, width, count)

  var page = page_opacity[0]
  var opacity = page_opacity[1]

  var height = divtag.guriguri_height
  var p = page * height
  var imgtag = divtag.guriguri_imgtag
  if (p || p == 0) {
   imgtag.style.marginTop = -p + "px"
  }

  //console.log("x:" + x + ", page:" + page + ", p:" + p + ", opacity:" + opacity + "***:" + imgtag.style.marginTop)
  if (!guriguri.isMSIE) {
   var imgtag2 = divtag.guriguri_imgtag2
   imgtag2.style.opacity = opacity
   //if (divtag.guriguri_automove) {
   // imgtag2.style.filter = "alpha(opacity=" + Math.floor(opacity * 100) + ")"
   //}
   imgtag2.style.MozOpacity = opacity
  }
 },

 getPageOpacity: function(x, width, count) {
  var p = x * (count * 2 - 1) / width
  var fp = Math.floor(p)
  var opacity = 0
  if (fp % 2 == 1) {
   opacity = p - fp
  }
  var page = Math.floor(fp / 2)
  
  return [page, opacity]
 }

}
