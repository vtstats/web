mod continuation;

use continuation::{Continuation, Video, A, B, C, D, E, F};
use quick_protobuf::{MessageWrite, Result, Writer};

pub fn get_continuation(channel_id: &str, stream_id: &str) -> Result<String> {
    let mut out = Vec::new();

    Continuation {
        b: Some(B {
            video: {
                let mut out = Vec::new();

                Video {
                    d: Some(D {
                        c: Some(C {
                            channel_id: channel_id.into(),
                            video_id: stream_id.into(),
                        }),
                    }),
                    f: Some(F {
                        e: Some(E {
                            video_id: stream_id.into(),
                        }),
                    }),
                    s4: 1,
                }
                .write_message(&mut Writer::new(&mut out))?;

                base64::encode(&out).into()
            },
            f6: 1,
            a: Some(A { f1: 1 }),
        }),
    }
    .write_message(&mut Writer::new(&mut out))?;

    Ok(base64::encode(&out))
}

#[test]
fn test() {
    pretty_assertions::assert_eq!(
        "0ofMyANhGlhDaWtxSndvWVZVTnhiVE5DVVV4c1NtWjJhMVJ6V0Y5b2RtMHdWVzFCRWd0eFRtVkthRXBXUkU5VE9Cb1Q2cWpkdVFFTkNndHhUbVZLYUVwV1JFOVRPQ0FCMAGCAQIIAQ==",
        get_continuation(
            "UCqm3BQLlJfvkTsX_hvm0UmA",
            "qNeJhJVDOS8",
        ).unwrap()
    );
}
