require 'sinatra'
require 'logger'
require 'fileutils'

set :env, :production

logfile = File.join(File.expand_path(File.dirname(__FILE__)), 'log/visit.log')

unless File.exist?(logfile)
  FileUtils.mkdir_p('log')
  File.open(logfile, 'w') do |f|
    f.puts Time.now
  end
end

$logger = Logger.new 'log/visit.log'

if defined?(run) 
  disable :run
  require './fdlint-host'
  run Sinatra::Application
else
  require './fdlint-host'
end
