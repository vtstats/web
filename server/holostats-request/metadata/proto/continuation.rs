// Automatically generated rust module for 'continuation.proto' file

#![allow(non_snake_case)]
#![allow(non_upper_case_globals)]
#![allow(non_camel_case_types)]
#![allow(unused_imports)]
#![allow(unknown_lints)]
#![allow(clippy::all)]
#![cfg_attr(rustfmt, rustfmt_skip)]


use std::borrow::Cow;
use quick_protobuf::{MessageRead, MessageWrite, BytesReader, Writer, WriterBackend, Result};
use quick_protobuf::sizeofs::*;
use super::*;

#[derive(Debug, Default, PartialEq, Clone)]
pub struct Continuation<'a> {
    pub a: Option<continuation::A<'a>>,
}

impl<'a> MessageRead<'a> for Continuation<'a> {
    fn from_reader(r: &mut BytesReader, bytes: &'a [u8]) -> Result<Self> {
        let mut msg = Self::default();
        while !r.is_eof() {
            match r.next_tag(bytes) {
                Ok(901661690) => msg.a = Some(r.read_message::<continuation::A>(bytes)?),
                Ok(t) => { r.read_unknown(bytes, t)?; }
                Err(e) => return Err(e),
            }
        }
        Ok(msg)
    }
}

impl<'a> MessageWrite for Continuation<'a> {
    fn get_size(&self) -> usize {
        0
        + self.a.as_ref().map_or(0, |m| 5 + sizeof_len((m).get_size()))
    }

    fn write_message<W: WriterBackend>(&self, w: &mut Writer<W>) -> Result<()> {
        if let Some(ref s) = self.a { w.write_with_tag(901661690, |w| w.write_message(s))?; }
        Ok(())
    }
}

#[derive(Debug, Default, PartialEq, Clone)]
pub struct A<'a> {
    pub video: Cow<'a, str>,
    pub timestamp: i64,
    pub f7: i32,
    pub f8: i32,
}

impl<'a> MessageRead<'a> for A<'a> {
    fn from_reader(r: &mut BytesReader, bytes: &'a [u8]) -> Result<Self> {
        let mut msg = Self::default();
        while !r.is_eof() {
            match r.next_tag(bytes) {
                Ok(26) => msg.video = r.read_string(bytes).map(Cow::Borrowed)?,
                Ok(32) => msg.timestamp = r.read_int64(bytes)?,
                Ok(56) => msg.f7 = r.read_int32(bytes)?,
                Ok(64) => msg.f8 = r.read_int32(bytes)?,
                Ok(t) => { r.read_unknown(bytes, t)?; }
                Err(e) => return Err(e),
            }
        }
        Ok(msg)
    }
}

impl<'a> MessageWrite for A<'a> {
    fn get_size(&self) -> usize {
        0
        + if self.video == "" { 0 } else { 1 + sizeof_len((&self.video).len()) }
        + if self.timestamp == 0i64 { 0 } else { 1 + sizeof_varint(*(&self.timestamp) as u64) }
        + if self.f7 == 0i32 { 0 } else { 1 + sizeof_varint(*(&self.f7) as u64) }
        + if self.f8 == 0i32 { 0 } else { 1 + sizeof_varint(*(&self.f8) as u64) }
    }

    fn write_message<W: WriterBackend>(&self, w: &mut Writer<W>) -> Result<()> {
        if self.video != "" { w.write_with_tag(26, |w| w.write_string(&**&self.video))?; }
        if self.timestamp != 0i64 { w.write_with_tag(32, |w| w.write_int64(*&self.timestamp))?; }
        if self.f7 != 0i32 { w.write_with_tag(56, |w| w.write_int32(*&self.f7))?; }
        if self.f8 != 0i32 { w.write_with_tag(64, |w| w.write_int32(*&self.f8))?; }
        Ok(())
    }
}

