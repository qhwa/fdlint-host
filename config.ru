require 'sinatra'
require 'logger'

set :env, :production

$logger = Logger.new 'log/visit.log'

if defined?(run) 
  disable :run
  require './fdlint-host'
  run Sinatra::Application
else
  require './fdlint-host'
end
