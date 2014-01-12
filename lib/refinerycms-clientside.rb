module Refinery
  module Clientside
    class Engine < ::Rails::Engine

      engine_name :refinery_clientside

      initializer 'register javascripts' do

        # Refinery::Core.config.register_javascript "refinery/refinery.min.js"

        ::Refinery::I18n.frontend_locales.each do |locale|
          file_path = "#{config.root}/lib/assets/javascripts/refinery/i18n/refinery-#{locale}.js"
          if File.exists?(file_path)
            Refinery::Core.config.register_I18n_javascript locale, "refinery/i18n/refinery-#{locale}.js"
          end
        end

        # Refinery::Core.config.register_admin_javascript "refinery/refinery.min.js"
        # Refinery::Core.config.register_admin_javascript "refinery/admin.min.js"
        Refinery::Core.config.register_admin_javascript "vendor/jquery-ui.min.js"
        Refinery::Core.config.register_admin_javascript "vendor/jquery.cookie.js"
        Refinery::Core.config.register_admin_javascript "vendor/jquery.iframe-transport.js"
        Refinery::Core.config.register_admin_javascript "vendor/nestedsortables.js"

        ::Refinery::I18n.locales.each do |locale|
          file_path = "#{config.root}/lib/assets/javascripts/refinery/i18n/refinery-#{locale}.js"
          if File.exists?(file_path)
            Refinery::Core.config.register_admin_I18n_javascript locale, "refinery/i18n/refinery-#{locale}.js"
          end
        end

        ::Refinery::I18n.locales.each do |locale|
          file_path = "#{config.root}/lib/assets/javascripts/refinery/i18n/admin/admin-#{locale}.js"
          if File.exists?(file_path)
            Refinery::Core.config.register_admin_I18n_javascript locale, "refinery/i18n/admin/admin-#{locale}.js"
          end
        end
      end

    end
  end
end
