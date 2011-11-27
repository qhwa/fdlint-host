# -*- encoding:utf-8

require 'sinatra'
require 'haml'
require 'base64'
require 'json'
require_relative '../fdev-xray/lib/runner'
require_relative 'app/helper/readstr'

$runner = XRay::Runner.new

configure do 
  set :views, File.dirname(__FILE__) << '/app/view'
  set :haml, :format => :html5
end

get('/') do
  haml :home
end

post '/' do
  bin = params['data']
  if Hash === bin and bin[:tempfile]
    name = bin[:filename]
    bin = bin[:tempfile].read 
  end
  text, encoding = readstr(bin)
  format_result name, text, *$runner.check(text)
end

def format_result(name, text, succ, results=[])
  if succ
    JSON.fast_generate({
      :src      => text,
      :success  => succ,
      :filename => name
    })
  else
    inf = results.inject([]) do |sum, r|
      sum << {
        :level  => r.level,
        :msg    => r.message,
        :row    => r.row,
        :column => r.column
      }
    end
    JSON.fast_generate({
      :src      => text,
      :success  => succ,
      :info     => inf,
      :filename => name
    })
  end
end
