// version 2009/08/07

var guriguri = {
 initialize: function() {
  var tags = guriguri.getGuriguriTags()
  for (var i = 0; i < tags.length; i++) {
   var tag = tags[i]

   try{
    var params = JSON.parse(tag.innerHTML)
    guriguri.changeDivTag(tag, params.src, params.height)
   } catch(e) {}
  }
  setInterval(guriguri.interval)
 },

 interval: function() {
  alert(1)
 },

 getGuriguriTags: function() {
  var tags = document.getElementsByTagName('div')
  var guriguri_tags = []
  for (var i = 0; i < tags.length; i++) {
   var tag = tags[i]
   if (tag.className == 'guriguri') {
    guriguri_tags.push(tag)
   }
  }
  return guriguri_tags
 },

 changeDivTag: function(divtag, src, height) {
  divtag.guriguri_height = height
  divtag.style.overflow = 'hidden'
  divtag.innerHTML = ''
  divtag.style.height = '0px'

  var imgtag = new Image()
  imgtag.src = src
  imgtag.onload = guriguri.onload_image

  divtag.appendChild(imgtag)
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
  divtag.guriguri_imgtag = imgtag

  divtag.style.width = width + 'px'
  divtag.style.height = divtag.guriguri_height + 'px'

  divtag.onmousemove = function(e) {guriguri.mousemove(e, this)}
 },

 mousemove: function(e, obj) {
  var width = obj.guriguri_width
  var height = obj.guriguri_height
  var count = obj.guriguri_count
  var imgtag = obj.guriguri_imgtag

  var x
  if (e) {
   x = e.layerX
  } else {
   x = event.offsetX
  }

  if (x >= width) { x = width - 1 }
  if (x < 0) { x = 0 }

  var p = Math.floor(x * count / width) * height

  imgtag.style.marginTop = -p + "px"
 }

}
