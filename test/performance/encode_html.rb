require 'uri'

str = IO.read('9930.html')
output = URI.escape(str.gsub(/\n|\r/m, ''))

File.open('post.txt', 'w') do |file|
  file << %Q(data=#{output}&type=html)
end
