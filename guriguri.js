// version 2009/08/07

var guriguri = {
 initialize: function() {
  guriguri.tags = guriguri.getGuriguriTags()
  for (var i = 0; i < guriguri.tags.length; i++) {
   var divtag = guriguri.tags[i]

   try{
    var params = JSON.parse(divtag.innerHTML)
    guriguri.changeDivTag(divtag, params.src, params.height)
   } catch(e) {}
  }
  setInterval(guriguri.interval, 1000)
 },

 interval: function() {
  for (var i = 0; i < guriguri.tags.length; i++) {
   var divtag = guriguri.tags[i]
   if (divtag.guriguri_automove) {

    var imgtag = divtag.guriguri_imgtag
    var height = divtag.guriguri_height
    var count  = divtag.guriguri_count

    var position  = divtag.guriguri_position 
    var direction = divtag.guriguri_direction

    position += direction
    if (position >= count) {
     position = count - 1
     direction = -1
    }
    if (position < 0) {
     position = 0
     direction = 1
    }

    //imgtag.style.marginTop = -(position * height) + "px"
    guriguri.show(divtag, position, 0.5)

    divtag.guriguri_position  = position
    divtag.guriguri_direction = direction
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
  divtag.guriguri_imgtag = imgtag
  divtag.appendChild(imgtag)

  var imgtag2 = new Image()
  imgtag2.src = src
  imgtag2.style.position = 'relative'
  imgtag2.style.opacity = 0.5
  imgtag2.style.left = "0px"
  divtag.guriguri_imgtag2 = imgtag2
  divtag.appendChild(imgtag2)

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
  //divtag.guriguri_imgtag = imgtag

  divtag.style.width = width + 'px'
  divtag.style.height = divtag.guriguri_height + 'px'

  divtag.guriguri_imgtag2.style.top = - divtag.guriguri_height * (count + 1) + "px"

  divtag.onmousemove = function(e) { guriguri.mousemove(e, this) }
  divtag.onmouseover = function(e) { this.guriguri_automove = false }
  divtag.onmouseout  = function(e) { this.guriguri_automove = true }
 },

 mousemove: function(e, divtag) {
  var width   = divtag.guriguri_width
  //var height  = divtag.guriguri_height
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

  var position = Math.floor(x * count / width)
//  imgtag.style.marginTop = -(position * height) + "px"
  guriguri.show(divtag, position, 0.5)

  divtag.guriguri_automove = false; 
  divtag.guriguri_position = position;
 },

 show: function(divtag, position, next_opacity) {
  var height = divtag.guriguri_height
  divtag.guriguri_imgtag.style.marginTop = -(position * height) + "px"
  divtag.guriguri_imgtag2.style.opacity = next_opacity
 }
}
