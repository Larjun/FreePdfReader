from gtts import gTTS
import os

text = "My sprinkler goes like thisstststststststststststststststststststststststst and comes back like ttttttttttttttttttttttttttttttttttttttt"

tts = gTTS(text, lang='fr')
tts.save('hello.mp3')
#os.system("mpg321 hello.mp3")