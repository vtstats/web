# remove identifiable information
for json in *.json
    jq 'walk(if type == "object" and .authorExternalChannelId != null then .authorExternalChannelId = "channelId" else . end)' $json | sponge $json
    jq 'walk(if type == "object" and .continuation != null then .continuation = "" else . end)' $json | sponge $json
    jq 'walk(if type == "object" and .id != null then .id = "id" else . end)' $json | sponge $json
    jq 'walk(if type == "object" and .url != null then .url = "https://example.com" else . end)' $json | sponge $json

    jq 'walk(if type == "object" then del(.feedbackToken, .trackingParams, .responseContext, .params, .clientId, .clickTrackingParams, .addLiveChatTickerItemAction) else . end)' $json | sponge $json
end
