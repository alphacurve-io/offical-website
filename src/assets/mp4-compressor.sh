input_file="./hero-section-background-video.mp4"
size="1080"
output_file="./hero-section-background-video-$size.mp4"
ffmpeg -i $input_file \
-an \
-r 15 \
-vf "scale=$size:-2" \
-c:v libx264 \
-crf 40 \
-preset slow \
-movflags +faststart \
$output_file