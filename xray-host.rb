# -*- encoding:utf-8

require 'sinatra'
require 'haml'
require 'base64'
require 'json'
require_relative 'lib/xray/lib/runner'
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
  name = nil
  if Hash === bin and bin[:tempfile]
    name = bin[:filename]
    bin = bin[:tempfile].read 
  end
  text, encoding = readstr(bin)
  if name
    result = $runner.send(:"check", text, name)
  else
    result = $runner.send(:"check_#{check_type params['type']}", text)
  end
  format_result name, text, result
end

def check_type(type)
  case type.downcase
    when /js/, /javascript/
      "js"
    when /css/, /stylesheet/
      "css"
    else
      "html"
  end
end

def format_result(name, text, results=[])
  succ = results.empty?
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
