<!-- Pagination -->
{{ paginator }}

{{#data}}
<div class="thumbnail instagram-thumb">
    {{#if videos }}
        <video width="150" controls>
            <source src="{{videos.low_resolution.url}}" type="video/mp4">
            Your browser does not support the video tag.
        </video>
    {{ else }}
        <img src="{{images.thumbnail.url}}" />
    {{/if}}
    <div class="caption">
    {{#first_n tags 8}}
      <span class="tag">{{ this }}</span>
    {{/first_n}}
    <p>{{caption.text}}</p>
    </div>
</div>
{{/data}}
