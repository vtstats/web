use pretty_assertions::assert_eq;
use roxmltree::Document;

use crate::pubsub::publish::{parse_deletion, parse_modification};

#[test]
fn modification() {
    let full = r#"
<feed xmlns:yt="http://www.youtube.com/xml/schemas/2015" xmlns="http://www.w3.org/2005/Atom">
    <link rel="hub" href="https://pubsubhubbub.appspot.com"/>
    <link rel="self" href="https://www.youtube.com/xml/feeds/videos.xml?channel_id=UCFahBR2wixu0xOex84bXFvg"/>
    <title>YouTube video feed</title>
    <updated>2020-09-15T16:00:00.018718+00:00</updated>
    <entry>
        <id>yt:video:hAo6NGQlkOA</id>
        <yt:videoId>hAo6NGQlkOA</yt:videoId>
        <yt:channelId>UCFahBR2wixu0xOex84bXFvg</yt:channelId>
        <title>【 歌枠 】久しぶりに歌ってやるんだ～～～～～～！！！」</title>
        <link rel="alternate" href="http://www.youtube.com/watch?v=hAo6NGQlkOA"/>
        <author>
            <name>Nakiri Ayame Ch. 百鬼あやめ</name>
            <uri>http://www.youtube.com/channel/UCFahBR2wixu0xOex84bXFvg</uri>
        </author>
        <published>2020-09-15T14:01:59.050+00:00</published>
        <updated>2020-09-15T16:00:00.018718+00:00</updated>
    </entry>
</feed>"#;

    assert_eq!(
        parse_modification(&Document::parse(full).unwrap()),
        Some(("miru", "hAo6NGQlkOA"))
    );

    let minimal = r#"
<feed xmlns:yt="http://www.youtube.com/xml/schemas/2015">
    <title></title>
    <entry>
        <yt:videoId>hAo6NGQlkOA</yt:videoId>
        <yt:channelId>UCFahBR2wixu0xOex84bXFvg</yt:channelId>
        <title>【 歌枠 】久しぶりに歌ってやるんだ～～～～～～！！！」</title>
    </entry>
</feed>"#;

    assert_eq!(
        parse_modification(&Document::parse(minimal).unwrap()),
        Some(("miru", "hAo6NGQlkOA"))
    );
}

#[test]
fn deletion() {
    let full = r#"
<feed xmlns:at="http://purl.org/atompub/tombstones/1.0" xmlns="http://www.w3.org/2005/Atom">
    <at:deleted-entry ref="yt:video:HJiD8KcZKfs" when="2020-10-23T15:34:56.217123+00:00">
        <link href="https://www.youtube.com/watch?v=HJiD8KcZKfs"/>
        <at:by>
            <name>Noel Ch. 白銀ノエル</name>
            <uri>https://www.youtube.com/channel/UC-o-1qjKkMLq-ZFxXIzOUBQ</uri>
        </at:by>
    </at:deleted-entry>
</feed>"#;

    assert_eq!(
        parse_deletion(&Document::parse(full).unwrap()),
        Some(("HJiD8KcZKfs", "ubye",))
    );

    let minimal = r#"
<feed xmlns:at="http://purl.org/atompub/tombstones/1.0">
    <at:deleted-entry ref="yt:video:HJiD8KcZKfs">
        <at:by>
            <uri>https://www.youtube.com/channel/UC-o-1qjKkMLq-ZFxXIzOUBQ</uri>
        </at:by>
    </at:deleted-entry>
</feed>"#;

    assert_eq!(
        parse_deletion(&Document::parse(minimal).unwrap()),
        Some(("HJiD8KcZKfs", "ubye",))
    );
}
