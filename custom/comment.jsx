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
                <h3 class="title is-5">{__('article.comments')}</h3>

                    <script src="https://giscus.app/client.js"
                        data-repo="SupeRuier/blog-giscus"
                        data-repo-id="R_kgDOHC5FJQ"
                        data-category="Announcements"
                        data-category-id="DIC_kwDOHC5FJc4CON5R"
                        data-mapping="pathname"
                        data-reactions-enabled="1"
                        data-emit-metadata="0"
                        data-input-position="bottom"
                        data-theme="light"
                        data-lang="zh-CN"
                        crossorigin="anonymous"
                        async>
                    </script>

            </div>
        </div>;
    }
};
