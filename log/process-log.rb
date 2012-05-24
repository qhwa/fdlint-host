#!/usr/bin/env ruby
# This script scans the log and finds out
# what file might has broke the fdlint host

def find_broken_src_from_log( file )
  broken_src = []
  IO.foreach(file) do |line|
    if is_src?(line)
      src = extract_src(line)
      broken_src << src
    elsif is_time?(line)
      broken_src.pop
    end
  end
  broken_src
end

def is_src?(line)
  line =~ /receive post/
end

def is_time?(line)
  line =~ /time elapsed: \d+ ms$/
end

def extract_src(line)
  txt = line[/"data"=>"(.*)",/, 1]
  src = Array.class_eval(%Q{["#{txt}"]}).first
end

src = find_broken_src_from_log( 'visit.log' )
puts "Find #{src.size} files!"
src.each_with_index do |src, lineno|
  File.open("broken-#{lineno}.html", 'w') do |file|
    file << src
  end
end
