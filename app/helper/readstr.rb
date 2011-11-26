def readstr(bin, opt={})
  %w(utf-8 gb18030 gbk gb2312 cp936).any? do |coding|
    begin
      text = bin.dup.encode('utf-8', coding).force_encoding('utf-8')
      return [text,coding] if text =~ /./
    rescue ArgumentError, Encoding::UndefinedConversionError, Encoding::InvalidByteSequenceError => e
      next
    end
  end
  return [nil,nil]
end
