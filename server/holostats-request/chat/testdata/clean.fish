# remove identifiable information
for json in *.json
    jq 'walk(if type == "object" and .authorExternalChannelId != null then .authorExternalChannelId = "channelId" else . end)' $json | sponge $json
    jq 'walk(if type == "object" and .clickTrackingParams != null then .clickTrackingParams = "" else . end)' $json | sponge $json
    jq 'walk(if type == "object" and .clientId != null then .clientId = "" else . end)' $json | sponge $json
    jq 'walk(if type == "object" and .continuation != null then .continuation = "" else . end)' $json | sponge $json
    jq 'walk(if type == "object" and .id != null then .id = "id" else . end)' $json | sponge $json
    jq 'walk(if type == "object" and .params != null then .params = "" else . end)' $json | sponge $json
    jq 'walk(if type == "object" and .responseContext != null then .responseContext = null else . end)' $json | sponge $json
    jq 'walk(if type == "object" and .trackingParams != null then .trackingParams = "" else . end)' $json | sponge $json
    jq 'walk(if type == "object" and .url != null then .url = "https://example.com" else . end)' $json | sponge $json
    jq 'walk(if type == "object" and .feedbackToken != null then .feedbackToken = "https://example.com" else . end)' $json | sponge $json
end
