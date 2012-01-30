require 'sinatra'

set :env, :production

if defined?(run) 
  disable :run
  require './fdlint-host'
  run Sinatra::Application
else
  require './fdlint-host'
end
