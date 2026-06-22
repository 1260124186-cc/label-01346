/**
 * 语音工具模块
 * @description 提供语音识别、语音合成、方言支持、语音命令解析等功能
 * 可对接微信同声传译插件或第三方语音服务
 */

const DIALECT_OPTIONS = [
  { id: 'zh-CN', name: '普通话', desc: '标准普通话识别' },
  { id: 'zh-HK', name: '粤语', desc: '广东话/粤语识别' },
  { id: 'zh-SC', name: '四川话', desc: '四川方言识别' },
  { id: 'zh-Henan', name: '河南话', desc: '河南方言识别' }
]

const DEFAULT_DIALECT = 'zh-CN'

const voiceState = {
  isRecognizing: false,
  isSpeaking: false,
  recorderManager: null,
  innerAudioContext: null,
  dialect: DEFAULT_DIALECT,
  voiceEnabled: true,
  speechRate: 1.0,
  pitch: 1.0
}

function getDialectOptions() {
  return DIALECT_OPTIONS
}

function getDefaultDialect() {
  return DEFAULT_DIALECT
}

function getCurrentDialect() {
  const stored = wx.getStorageSync('voiceDialect')
  return stored || voiceState.dialect
}

function setDialect(dialectId) {
  const valid = DIALECT_OPTIONS.some(d => d.id === dialectId)
  if (valid) {
    voiceState.dialect = dialectId
    wx.setStorageSync('voiceDialect', dialectId)
    console.log('[Voice] 方言已设置为:', dialectId)
    return true
  }
  return false
}

function isVoiceEnabled() {
  const stored = wx.getStorageSync('voiceEnabled')
  return stored !== false
}

function setVoiceEnabled(enabled) {
  voiceState.voiceEnabled = enabled
  wx.setStorageSync('voiceEnabled', enabled)
  console.log('[Voice] 语音模式:', enabled ? '开启' : '关闭')
}

function getSpeechRate() {
  const stored = wx.getStorageSync('speechRate')
  return stored || voiceState.speechRate
}

function setSpeechRate(rate) {
  const validRate = Math.max(0.5, Math.min(2.0, rate))
  voiceState.speechRate = validRate
  wx.setStorageSync('speechRate', validRate)
}

function getRecorderManager() {
  if (!voiceState.recorderManager) {
    voiceState.recorderManager = wx.getRecorderManager()
  }
  return voiceState.recorderManager
}

function getInnerAudioContext() {
  if (!voiceState.innerAudioContext) {
    voiceState.innerAudioContext = wx.createInnerAudioContext()
  }
  return voiceState.innerAudioContext
}

function initRecorder(callbacks = {}) {
  const recorder = getRecorderManager()

  recorder.onStart(() => {
    console.log('[Voice] 录音开始')
    voiceState.isRecognizing = true
    if (callbacks.onStart) callbacks.onStart()
  })

  recorder.onStop((res) => {
    console.log('[Voice] 录音结束', res)
    voiceState.isRecognizing = false
    if (callbacks.onStop) callbacks.onStop(res)
  })

  recorder.onError((err) => {
    console.error('[Voice] 录音错误', err)
    voiceState.isRecognizing = false
    if (callbacks.onError) callbacks.onError(err)
  })

  recorder.onFrameRecorded((res) => {
    if (callbacks.onFrameRecorded) callbacks.onFrameRecorded(res)
  })

  return recorder
}

function startRecord(options = {}) {
  const recorder = getRecorderManager()
  const dialect = getCurrentDialect()

  const recordOptions = {
    duration: options.duration || 60000,
    sampleRate: options.sampleRate || 16000,
    numberOfChannels: options.numberOfChannels || 1,
    encodeBitRate: options.encodeBitRate || 48000,
    format: options.format || 'mp3',
    frameSize: options.frameSize || 1
  }

  recorder.start(recordOptions)
  console.log('[Voice] 开始录音，方言:', dialect)

  return new Promise((resolve, reject) => {
    const onStop = (res) => {
      resolve(res)
      recorder.offStop(onStop)
      recorder.offError(onError)
    }
    const onError = (err) => {
      reject(err)
      recorder.offStop(onStop)
      recorder.offError(onError)
    }
    recorder.onStop(onStop)
    recorder.onError(onError)
  })
}

function stopRecord() {
  const recorder = getRecorderManager()
  recorder.stop()
  voiceState.isRecognizing = false
  console.log('[Voice] 停止录音')
}

function recognizeVoice(audioFilePath) {
  console.log('[Voice] 语音识别，文件:', audioFilePath)
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockResults = generateMockRecognitionResult()
      resolve({
        success: true,
        text: mockResults.text,
        confidence: mockResults.confidence,
        dialect: getCurrentDialect()
      })
    }, 800)
  })
}

const MOCK_SEARCH_PHRASES = [
  '奶茶杯怎么扔',
  '塑料瓶是什么垃圾',
  '电池属于什么垃圾',
  '剩饭菜怎么处理',
  '旧报纸可以回收吗',
  '过期药品是什么垃圾',
  '玻璃瓶可以回收吗',
  '废旧衣服怎么扔',
  '外卖餐盒是什么垃圾',
  '果壳属于什么垃圾'
]

const MOCK_QUIZ_COMMANDS = [
  '选择A',
  '选第一个',
  '选B选项',
  '第二个',
  '选C',
  '第三个是对的',
  'D选项',
  '下一题',
  '上一题',
  '再说一遍'
]

function generateMockRecognitionResult() {
  const dialect = getCurrentDialect()
  const allPhrases = [...MOCK_SEARCH_PHRASES, ...MOCK_QUIZ_COMMANDS]
  const randomPhrase = allPhrases[Math.floor(Math.random() * allPhrases.length)]
  
  let text = randomPhrase
  let confidence = 0.85 + Math.random() * 0.1
  
  if (dialect === 'zh-HK') {
    const cantoneseMap = {
      '奶茶杯怎么扔': '奶茶杯點掉',
      '塑料瓶是什么垃圾': '膠樽係乜嘢垃圾',
      '选择A': '揀A',
      '选第一个': '揀第一個'
    }
    text = cantoneseMap[randomPhrase] || randomPhrase
    confidence = 0.75 + Math.random() * 0.15
  }
  
  return { text, confidence }
}

function speak(text, options = {}) {
  return new Promise((resolve, reject) => {
    if (!isVoiceEnabled()) {
      resolve({ success: false, reason: 'voice_disabled' })
      return
    }

    if (!text || !text.trim()) {
      resolve({ success: false, reason: 'empty_text' })
      return
    }

    console.log('[Voice] 语音播报:', text)

    stopSpeak()

    const audio = getInnerAudioContext()
    const rate = getSpeechRate()

    voiceState.isSpeaking = true

    if (options.onStart) {
      audio.onPlay(() => {
        options.onStart && options.onStart()
      })
    }

    audio.onEnded(() => {
      voiceState.isSpeaking = false
      console.log('[Voice] 播放结束')
      if (options.onEnd) options.onEnd()
      resolve({ success: true, duration: 0 })
    })

    audio.onError((err) => {
      voiceState.isSpeaking = false
      console.error('[Voice] 播放错误', err)
      if (options.onError) options.onError(err)
      reject(err)
    })

    if (options.useTTS) {
      audio.src = generateMockTTSUrl(text, rate)
      audio.play()
    } else {
      const estimatedDuration = Math.ceil(text.length * 0.3 / rate) * 1000
      console.log('[Voice] 模拟播报，预计时长:', estimatedDuration, 'ms')
      
      if (options.onStart) options.onStart()
      
      setTimeout(() => {
        voiceState.isSpeaking = false
        if (options.onEnd) options.onEnd()
        resolve({ success: true, duration: estimatedDuration, simulated: true })
      }, estimatedDuration)
    }
  })
}

function generateMockTTSUrl(text, rate) {
  const encoded = encodeURIComponent(text)
  return `https://example.com/tts?text=${encoded}&rate=${rate}`
}

function stopSpeak() {
  const audio = voiceState.innerAudioContext
  if (audio) {
    audio.stop()
  }
  voiceState.isSpeaking = false
  console.log('[Voice] 停止播报')
}

function pauseSpeak() {
  const audio = voiceState.innerAudioContext
  if (audio) {
    audio.pause()
  }
}

function resumeSpeak() {
  const audio = voiceState.innerAudioContext
  if (audio) {
    audio.play()
  }
}

const VOICE_COMMANDS = {
  QUIZ: {
    SELECT: ['选择', '选', '点', '按', '回答'],
    OPTION_A: ['A', 'a', '诶', '第一', '1', '壹'],
    OPTION_B: ['B', 'b', '必', '第二', '2', '贰'],
    OPTION_C: ['C', 'c', '西', '第三', '3', '叁'],
    OPTION_D: ['D', 'd', '地', '第四', '4', '肆'],
    NEXT: ['下一题', '下一个', '下道题', '继续', '下'],
    PREV: ['上一题', '上一个', '上道题', '返回', '上'],
    REPEAT: ['再说一遍', '重复', '再读一遍', '没听清', '什么'],
    SUBMIT: ['提交', '确定', '确认', '就这个']
  },
  SEARCH: {
    SEARCH: ['搜索', '查找', '查一下', '搜一下', '怎么扔', '是什么垃圾', '属于什么'],
    HELP: ['帮助', '怎么用', '说明']
  },
  GLOBAL: {
    CANCEL: ['取消', '停止', '退出', '关闭'],
    CONFIRM: ['确定', '好的', '可以', '行', '嗯'],
    BACK: ['返回', '回去', '上一页']
  }
}

function parseVoiceCommand(text, context = 'general') {
  const lowerText = text.trim()
  const result = {
    raw: text,
    action: null,
    params: {},
    confidence: 0.8
  }

  for (const keyword of VOICE_COMMANDS.GLOBAL.CANCEL) {
    if (lowerText.includes(keyword)) {
      result.action = 'cancel'
      return result
    }
  }

  for (const keyword of VOICE_COMMANDS.GLOBAL.BACK) {
    if (lowerText.includes(keyword)) {
      result.action = 'back'
      return result
    }
  }

  for (const keyword of VOICE_COMMANDS.GLOBAL.CONFIRM) {
    if (lowerText === keyword || lowerText.includes(keyword + '。')) {
      result.action = 'confirm'
      return result
    }
  }

  if (context === 'quiz') {
    return parseQuizCommand(lowerText, result)
  }

  if (context === 'search') {
    return parseSearchCommand(lowerText, result)
  }

  return result
}

function parseQuizCommand(text, result) {
  for (const keyword of VOICE_COMMANDS.QUIZ.NEXT) {
    if (text.includes(keyword)) {
      result.action = 'next'
      return result
    }
  }

  for (const keyword of VOICE_COMMANDS.QUIZ.PREV) {
    if (text.includes(keyword)) {
      result.action = 'prev'
      return result
    }
  }

  for (const keyword of VOICE_COMMANDS.QUIZ.REPEAT) {
    if (text.includes(keyword)) {
      result.action = 'repeat'
      return result
    }
  }

  for (const keyword of VOICE_COMMANDS.QUIZ.SUBMIT) {
    if (text.includes(keyword)) {
      result.action = 'submit'
      return result
    }
  }

  const optionMap = [
    { keywords: VOICE_COMMANDS.QUIZ.OPTION_A, index: 0, label: 'A' },
    { keywords: VOICE_COMMANDS.QUIZ.OPTION_B, index: 1, label: 'B' },
    { keywords: VOICE_COMMANDS.QUIZ.OPTION_C, index: 2, label: 'C' },
    { keywords: VOICE_COMMANDS.QUIZ.OPTION_D, index: 3, label: 'D' }
  ]

  for (const opt of optionMap) {
    for (const kw of opt.keywords) {
      if (text.includes(kw)) {
        result.action = 'select'
        result.params = { optionIndex: opt.index, optionLabel: opt.label }
        return result
      }
    }
  }

  return result
}

function parseSearchCommand(text, result) {
  let keyword = text
  
  for (const prefix of VOICE_COMMANDS.SEARCH.SEARCH) {
    if (keyword.startsWith(prefix)) {
      keyword = keyword.slice(prefix.length)
      break
    }
  }

  for (const suffix of VOICE_COMMANDS.SEARCH.SEARCH) {
    if (keyword.endsWith(suffix)) {
      keyword = keyword.slice(0, -suffix.length)
      break
    }
  }

  keyword = keyword.trim()
  
  if (keyword) {
    result.action = 'search'
    result.params = { keyword }
  }

  return result
}

function speakTrashSummary(trashItem) {
  if (!trashItem) return Promise.resolve()

  const summary = `${trashItem.name}，属于${trashItem.typeName}。${trashItem.description || ''}`
  return speak(summary, { useTTS: false })
}

function speakQuizQuestion(question) {
  if (!question) return Promise.resolve()

  let text = `第${question.index + 1}题：${question.question}。`
  
  if (question.optionsWithLabel) {
    question.optionsWithLabel.forEach((opt, i) => {
      text += `${opt.label}，${opt.text}。`
    })
  }

  return speak(text, { useTTS: false })
}

function speakQuizResult(isCorrect, explanation) {
  const resultText = isCorrect ? '回答正确！' : '回答错误。'
  const text = explanation 
    ? `${resultText}${explanation}` 
    : resultText
  
  return speak(text, { useTTS: false })
}

function isSpeaking() {
  return voiceState.isSpeaking
}

function isRecognizing() {
  return voiceState.isRecognizing
}

function destroyVoice() {
  stopSpeak()
  stopRecord()
  
  if (voiceState.innerAudioContext) {
    voiceState.innerAudioContext.destroy()
    voiceState.innerAudioContext = null
  }
  if (voiceState.recorderManager) {
    voiceState.recorderManager = null
  }
  
  console.log('[Voice] 语音资源已释放')
}

module.exports = {
  getDialectOptions,
  getDefaultDialect,
  getCurrentDialect,
  setDialect,
  isVoiceEnabled,
  setVoiceEnabled,
  getSpeechRate,
  setSpeechRate,
  initRecorder,
  startRecord,
  stopRecord,
  recognizeVoice,
  speak,
  stopSpeak,
  pauseSpeak,
  resumeSpeak,
  parseVoiceCommand,
  speakTrashSummary,
  speakQuizQuestion,
  speakQuizResult,
  isSpeaking,
  isRecognizing,
  destroyVoice,
  getRecorderManager,
  getInnerAudioContext
}
