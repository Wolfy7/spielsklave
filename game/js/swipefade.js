var SwipeFade = (function () {
  var currentCallback = nothing
  var container = null

  function createContainer () {
    container = game.add.group()
    container.fixedToCamera = true
  }

  function addBlackSharp (x, y) {
    return G.Sprite(x, y, 'raute', container)
  }

  function addBlackScreenShape (config) {
    var black = G.Sprite(config.x, config.y, 'black', container)
    black.width = game.width + 24
    black.height = game.height + 24
    black.anchor.set(config.ax, config.ay)
    return black
  }

  function tweenContainer (position) {
    var tween = G.TweenCubic(container.cameraOffset, {
      x: position.x,
      y: position.y
    }, 800, callBackAndDestroy).start()

    function callBackAndDestroy () {
      currentCallback()
      setTimeout(container.destroy.bind(container), 10)
    }
  }

  function createZigZagLine (position, isVertical) {
    var spikes = Math.floor((!isVertical ? Game.width : Game.height) / 24)

    for (var i = 0; i < spikes; i++) {
      var nx = position.x
      var ny = position.y

      isVertical ? ny *= i : nx *= i

      addBlackSharp(nx, ny)
    }
  }

  function createVerticalZigZagLine (position) {
    createZigZagLine(position, true)
  }

  function createHorizontalZigZagLine (position) {
    createZigZagLine(position, false)
  }

  function swipeFromLeftToCenter () {
    createVerticalZigZagLine({x: -24, y: 24})
    addBlackScreenShape({x: -12, y: 0, ax: 1, ay: 0})
    tweenContainer({x: game.width + 24, y: 0})
  }

  function swipeFromRightToCenter () {
    createVerticalZigZagLine({x: game.width, y: 24})
    addBlackScreenShape({x: game.width + 12, y: 0, ax: 0, ay: 0})
    tweenContainer({x: -game.width - 12, y: 0})
  }

  function swipeFromUpToCenter () {
    createHorizontalZigZagLine({x: 24, y: -24})
    addBlackScreenShape({x: 0, y: -12, ax: 0, ay: 1})
    tweenContainer({x: 0, y: game.height + 36})
  }

  function swipeFromDownToCenter () {
    createHorizontalZigZagLine({x: 24, y: game.height})
    addBlackScreenShape({x: 0, y: game.height + 12, ax: 0, ay: 0})
    tweenContainer({x: 0, y: -game.height - 24})
  }

  function swipeFromCenterToRight () {
    createVerticalZigZagLine({x: -24, y: 24})
    addBlackScreenShape({x: -12, y: 0, ax: 0, ay: 0})
    tweenContainer({x: game.width + 24, y: 0})
  }

  function swipeFromCenterToLeft () {
    createVerticalZigZagLine({x: game.width + 12, y: 24})
    addBlackScreenShape({x: 0, y: 0, ax: 0, ay: 0})
    tweenContainer({x: -game.width - 36, y: 0})
  }

  function swipeFromCenterToDown () {
    createHorizontalZigZagLine({x: 24, y: -36})
    addBlackScreenShape({x: 0, y: game.height, ax: 0, ay: 1})
    tweenContainer({x: 0, y: game.height + 36})
  }

  function swipeFromCenterToUp () {
    createHorizontalZigZagLine({x: 24, y: game.height})
    addBlackScreenShape({x: 0, y: game.height + 12, ax: 0, ay: 1})
    tweenContainer({x: 0, y: -game.height - 24})
  }

  function setWorldTransitionOn () {
    WORLD.isInTransition = true
  }

  function setWorldBackground () {
    WORLD.stage.backgroundColor = MAPDATA[nextMapId].backgroundColor
  }

  function prepareWorld () {
    setWorldTransitionOn()
    setWorldBackground()
  }

  function swipeFunctionCall (from, to) {
    from = TB.capitalise(from.toLowerCase())
    to = TB.capitalise(to.toLowerCase())
    eval('swipeFrom' + from + 'To' + to)()
  }

  function swipeIn (to, callBack) {
    currentCallback = callBack || nothing
    prepareWorld()
    createContainer()
    swipeFunctionCall('Center', to)
  }

  function swipeOut (from, callBack) {
    currentCallback = callBack || nothing
    prepareWorld()
    createContainer()
    swipeFunctionCall(from, 'Center')
  }

  return {
    out: swipeOut,
    in: swipeIn
  }
}())
