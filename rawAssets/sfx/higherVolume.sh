#
# The volume of the wav-files i found was too low. This makes it 20 times higher :-)
#

for i in *.wav;
  do name=`echo $i | cut -d'.' -f1`;
  echo $name;
  ffmpeg -i "$i" -filter:a "volume=20" "./higherVolume/${name}.wav"
done
