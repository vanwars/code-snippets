var pages = [
    {
        template_path: "all_samples.tpl",
        target: "#content",
        type: "list",
        api_url: "http://dev.localground.org/api/0/forms/10/data/"
    },
    {
        template_path: "all_tags.tpl",
        target: ".rightColumn",
        type: "list",
        api_url: "http://dev.localground.org/api/0/forms/10/data/",
        query_params: {
            page_size: 100
        }
    },
    {
        url: "level/all",
        template_path: "all_samples.tpl",
        target: "#content",
        type: "list",
        api_url: "http://dev.localground.org/api/0/forms/10/data/"
    },
    {
        url: "level/:level",
        template_path: "all_samples.tpl",
        target: "#content",
        type: "list",
        api_url: "http://dev.localground.org/api/0/forms/10/data/",
        query_params: {
            query: "where level = '{{ level }}'"
        }
    },
    {
        url: "tags/:tag",
        template_path: "all_samples.tpl",
        target: "#content",
        type: "list",
        api_url: "http://dev.localground.org/api/0/forms/10/data/",
        query_params: {
            query: "where tags like '%{{ tag }}%'"
        }
    }
];
