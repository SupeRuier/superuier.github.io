const logger = require('hexo-log')();
const { Component } = require('inferno');
const view = require('hexo-component-inferno/lib/core/view');

module.exports = class extends Component {
    render() {
        const { config, page, helper } = this.props;
        const { __ } = helper;
        const { comment } = config;
        // if (!comment || typeof comment.type !== 'string') {
        //     return null;
        // }

        return <div class="card">
            <div class="card-content">
                {(() => {
                    if (config.giscus.enable === true) {
                        return <script src="https://giscus.app/client.js"
                        data-repo={config.giscus.data_repo}
                        data-repo-id={config.giscus.data_repo_id}
                        data-category={config.giscus.data_category}
                        data-category-id={config.giscus.data_category_id}
                        data-mapping={config.giscus.data_mapping}
                        data-reactions-enabled={config.giscus.data_reactions_enabled}
                        data-emit-metadata={config.giscus.data_emit_metadata}
                        data-input-position={config.giscus.data_input_position}
                        data-theme={config.giscus.data_theme}
                        data-lang={config.giscus.data_lang}
                        crossorigin={config.giscus.crossorigin}
                        async>
                        </script>
                    } 
                })()}
            </div>
        </div>;
    }
};
