// version 2009/08/07

var guriguri = {
 tags: 123,

 initialize: function() {
  guriguri.tags = guriguri.getGuriguriTags()
  for (var i = 0; i < guriguri.tags.length; i++) {
   var tag = guriguri.tags[i]

   try{
    var params = JSON.parse(tag.innerHTML)
    guriguri.changeDivTag(tag, params.src, params.height)
   } catch(e) {}
  }
  setInterval(guriguri.interval, 1000)
 },

 interval: function() {
  for (var i = 0; i < guriguri.tags.length; i++) {
   var tag = guriguri.tags[i]
   if (tag.guriguri_automove) {

    var imgtag = tag.guriguri_imgtag
    var height = tag.guriguri_height
    var count = tag.guriguri_count


    var position = tag.guriguri_position 
    var direction = tag.guriguri_direction

    position += direction
    if (position >= count) {
     position = count - 1
     direction = -1
    }
    if (position < 0) {
     position = 0
     direction = 1
    }

    imgtag.style.marginTop = -(position * height) + "px"

    tag.guriguri_position = position
    tag.guriguri_direction = direction
   }
  }
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

  divtag.guriguri_automove = true
  divtag.guriguri_position = 0
  divtag.guriguri_direction = 1

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

  divtag.onmousemove = function(e) { guriguri.mousemove(e, this) }
  divtag.onmouseover = function(e) { this.guriguri_automove = false }
  divtag.onmouseout  = function(e) { this.guriguri_automove = true }
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

  var position = Math.floor(x * count / width)
  imgtag.style.marginTop = -(position * height) + "px"

  obj.guriguri_automove = false; 
  obj.guriguri_position = position; 
 }
}
