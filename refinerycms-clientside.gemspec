# Encoding: UTF-8
Gem::Specification.new do |s|
  s.platform          = Gem::Platform::RUBY
  s.name              = %q{refinerycms-clientside}
  s.version           = '0.0.1'
  s.description       = %q{Js, Css and Images for refinerycms}
  s.summary           = %q{Js, Css and Images for refinerycms}
  s.email             = %q{nospam.keram@gmail.com}
  s.homepage          = %q{http://refinery.sk}
  s.authors           = ['Marek Labos']
  s.license           = 'MIT'
  s.require_paths     = %w(lib)

  s.files             = `git ls-files -- lib/*`.split("\n")
  s.require_paths     = %w(lib)
end
