require 'cdo/session'

module Rack
  class Request
    def json_body()
      return nil unless content_type.split(';').first == 'application/json'
      return nil unless content_charset.downcase == 'utf-8'
      JSON.parse(body.read, symbolize_names: true)
    end

    def language()
      locale.split('-').first
    end

    def locale()
      env['cdo.locale'] || 'en-US'
    end

    def referer_site_with_port()
      url = URI.parse(self.referer.to_s)
      host = http_host_and_port(url.host, url.port)
      return host if host.include?('csedweek.org')
      return host if host.include?('code.org')
      return 'code.org'
    rescue URI::InvalidURIError
      return 'code.org'
    end

    def site()
      @site ||= site_from_host
    end

    def site_from_host()
      host_parts = host
      # staging-studio.code.org -> ['staging', 'studio', 'code', 'org']
      host_parts.sub!('-', '.') unless rack_env?(:production)
      parts = host_parts.split('.')

      if parts.count >= 3
        domains = %w(studio learn i18n al ar br italia ro sg eu uk za).map{|x|x + '.code.org'} + %w(translate.hourofcode.com)
        domain = parts.last(3).join('.').split(':').first
        return domain if domains.include? domain
      end

      domain = parts.last(2).join('.').split(':').first
      return domain if %w(csedweek.org hourofcode.com).include?(domain)

      'code.org'
    end

    def shared_cookie_domain()
      @shared_cookie_domain ||= shared_cookie_domain_from_host
    end

    def shared_cookie_domain_from_host()
      parts = host.split('.')
      if parts.count >= 2
        domain_suffix = parts.last(2).join('.')
        return domain_suffix if domain_suffix == 'code.org'
      end
      host
    end

    def splat_path_info()
      self.env[:splat_path_info]
    end

    def user_id()
      @user_id ||= user_id_from_session_cookie
    end

    def user_id_from_session_cookie()
      message = CGI.unescape(cookies[Session::KEY].to_s)

      key_generator = ActiveSupport::KeyGenerator.new(
        CDO.dashboard_secret_key_base,
        iterations: 1000
      )

      encryptor = ActiveSupport::MessageEncryptor.new(
        key_generator.generate_key('encrypted cookie'),
        key_generator.generate_key('signed encrypted cookie')
      )

      return nil unless cookie = encryptor.decrypt_and_verify(message)
      return nil unless warden = cookie['warden.user.user.key']
      warden.first.first
    rescue
      return nil
    end
  end
end
