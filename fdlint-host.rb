# -*- encoding:utf-8

require 'sinatra'
require 'haml'
require 'base64'
require 'json'
require 'logger'
require 'fdlint'

$logger ||= Logger.new(STDOUT)

configure do 
  set :views, File.dirname(__FILE__) << '/app/view'
  set :haml, :format => :html5
end

helpers do 

  def js(path)
    "<script type=\"text/javascript\" src=\"#{to path}\"></script>"
  end

  def css(path)
    "<link type=\"text/css\" rel=\"stylesheet\" href=\"#{to path}\" />"
  end

end

get('/') do
  haml :home
end

post '/' do
  text    = params['data']
  options = prepare_options(params['options'] || {})
  name    = nil

  if Hash === text and text[:tempfile]
    name = text[:filename]
    text = text[:tempfile].read
    name.utf8! if name
    text.utf8!
  end

  $logger.info "receive post #{params}"
  t = Time.now

  options[:text] = text

  @results = Fdlint::Validator.new( nil, options ).validate
  @results = format_result name, text, @results
  
  t = (Time.now - t)*1000
  $logger.info "time elapsed: %d ms" % t

  if params['format'] == 'html'
    @src = text
    haml :home
  else
    @results
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

def prepare_options(options)
  ret = {}
  options.each do |k, v|
    ret[k.to_sym] = v
  end
  ret[:syntax] = options['type']
  ret
end
