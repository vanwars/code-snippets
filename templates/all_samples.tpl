<!-- List Display -->
{{#if tag}}<h2>Tag: <small>{{ tag }}</small></h2>{{/if }}
{{#if level}}<h2>Level: <small>{{ level }}</small></h2>{{/if }}

<!-- Pagination -->
{{ paginator }}

<!-- Data -->
<table class="table">
{{#results}}
	<tr>
        <td class="narrow">
            <span class="badge"><a href="#/level/{{level}}">{{level}}</a></span>
        </td>
        <td>
            <strong><a href="{{example_url}}" target="_blank">{{ description }}</a></strong>
            <br>
            {{tagify tags}}
            {{#if source }}
                <br>
                <a class="small-link" href="{{source}}" target="_blank">learn more...</a>
            {{/if }}
        </td>
	</tr>
{{/results}}
</table>