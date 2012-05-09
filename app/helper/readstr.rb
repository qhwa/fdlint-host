class String

  def utf8!
    %w(ascii-8bit utf-8 ucs-bom shift-jis gb18030 gbk gb2312 cp936).any? do |c|
      begin
        if self.respond_to? :encode
          self.encode!('utf-8', c).force_encoding('utf-8')
        else
          require 'iconv'
          text = Iconv.new('UTF-8', c).iconv(self)
        end
        if self =~ /./
          $enc = c
          return self
        end
      rescue
      end
    end

    self
    
  end

end
