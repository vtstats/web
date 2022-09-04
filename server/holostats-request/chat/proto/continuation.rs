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
pub struct A {
    pub f1: i32,
}

impl<'a> MessageRead<'a> for A {
    fn from_reader(r: &mut BytesReader, bytes: &'a [u8]) -> Result<Self> {
        let mut msg = Self::default();
        while !r.is_eof() {
            match r.next_tag(bytes) {
                Ok(8) => msg.f1 = r.read_int32(bytes)?,
                Ok(t) => { r.read_unknown(bytes, t)?; }
                Err(e) => return Err(e),
            }
        }
        Ok(msg)
    }
}

impl MessageWrite for A {
    fn get_size(&self) -> usize {
        0
        + if self.f1 == 0i32 { 0 } else { 1 + sizeof_varint(*(&self.f1) as u64) }
    }

    fn write_message<W: WriterBackend>(&self, w: &mut Writer<W>) -> Result<()> {
        if self.f1 != 0i32 { w.write_with_tag(8, |w| w.write_int32(*&self.f1))?; }
        Ok(())
    }
}

#[derive(Debug, Default, PartialEq, Clone)]
pub struct B<'a> {
    pub video: Cow<'a, str>,
    pub f6: i32,
    pub a: Option<continuation::A>,
}

impl<'a> MessageRead<'a> for B<'a> {
    fn from_reader(r: &mut BytesReader, bytes: &'a [u8]) -> Result<Self> {
        let mut msg = Self::default();
        while !r.is_eof() {
            match r.next_tag(bytes) {
                Ok(26) => msg.video = r.read_string(bytes).map(Cow::Borrowed)?,
                Ok(48) => msg.f6 = r.read_int32(bytes)?,
                Ok(130) => msg.a = Some(r.read_message::<continuation::A>(bytes)?),
                Ok(t) => { r.read_unknown(bytes, t)?; }
                Err(e) => return Err(e),
            }
        }
        Ok(msg)
    }
}

impl<'a> MessageWrite for B<'a> {
    fn get_size(&self) -> usize {
        0
        + if self.video == "" { 0 } else { 1 + sizeof_len((&self.video).len()) }
        + if self.f6 == 0i32 { 0 } else { 1 + sizeof_varint(*(&self.f6) as u64) }
        + self.a.as_ref().map_or(0, |m| 2 + sizeof_len((m).get_size()))
    }

    fn write_message<W: WriterBackend>(&self, w: &mut Writer<W>) -> Result<()> {
        if self.video != "" { w.write_with_tag(26, |w| w.write_string(&**&self.video))?; }
        if self.f6 != 0i32 { w.write_with_tag(48, |w| w.write_int32(*&self.f6))?; }
        if let Some(ref s) = self.a { w.write_with_tag(130, |w| w.write_message(s))?; }
        Ok(())
    }
}

#[derive(Debug, Default, PartialEq, Clone)]
pub struct Continuation<'a> {
    pub b: Option<continuation::B<'a>>,
}

impl<'a> MessageRead<'a> for Continuation<'a> {
    fn from_reader(r: &mut BytesReader, bytes: &'a [u8]) -> Result<Self> {
        let mut msg = Self::default();
        while !r.is_eof() {
            match r.next_tag(bytes) {
                Ok(957547474) => msg.b = Some(r.read_message::<continuation::B>(bytes)?),
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
        + self.b.as_ref().map_or(0, |m| 5 + sizeof_len((m).get_size()))
    }

    fn write_message<W: WriterBackend>(&self, w: &mut Writer<W>) -> Result<()> {
        if let Some(ref s) = self.b { w.write_with_tag(957547474, |w| w.write_message(s))?; }
        Ok(())
    }
}

#[derive(Debug, Default, PartialEq, Clone)]
pub struct C<'a> {
    pub channel_id: Cow<'a, str>,
    pub video_id: Cow<'a, str>,
}

impl<'a> MessageRead<'a> for C<'a> {
    fn from_reader(r: &mut BytesReader, bytes: &'a [u8]) -> Result<Self> {
        let mut msg = Self::default();
        while !r.is_eof() {
            match r.next_tag(bytes) {
                Ok(10) => msg.channel_id = r.read_string(bytes).map(Cow::Borrowed)?,
                Ok(18) => msg.video_id = r.read_string(bytes).map(Cow::Borrowed)?,
                Ok(t) => { r.read_unknown(bytes, t)?; }
                Err(e) => return Err(e),
            }
        }
        Ok(msg)
    }
}

impl<'a> MessageWrite for C<'a> {
    fn get_size(&self) -> usize {
        0
        + if self.channel_id == "" { 0 } else { 1 + sizeof_len((&self.channel_id).len()) }
        + if self.video_id == "" { 0 } else { 1 + sizeof_len((&self.video_id).len()) }
    }

    fn write_message<W: WriterBackend>(&self, w: &mut Writer<W>) -> Result<()> {
        if self.channel_id != "" { w.write_with_tag(10, |w| w.write_string(&**&self.channel_id))?; }
        if self.video_id != "" { w.write_with_tag(18, |w| w.write_string(&**&self.video_id))?; }
        Ok(())
    }
}

#[derive(Debug, Default, PartialEq, Clone)]
pub struct D<'a> {
    pub c: Option<continuation::C<'a>>,
}

impl<'a> MessageRead<'a> for D<'a> {
    fn from_reader(r: &mut BytesReader, bytes: &'a [u8]) -> Result<Self> {
        let mut msg = Self::default();
        while !r.is_eof() {
            match r.next_tag(bytes) {
                Ok(42) => msg.c = Some(r.read_message::<continuation::C>(bytes)?),
                Ok(t) => { r.read_unknown(bytes, t)?; }
                Err(e) => return Err(e),
            }
        }
        Ok(msg)
    }
}

impl<'a> MessageWrite for D<'a> {
    fn get_size(&self) -> usize {
        0
        + self.c.as_ref().map_or(0, |m| 1 + sizeof_len((m).get_size()))
    }

    fn write_message<W: WriterBackend>(&self, w: &mut Writer<W>) -> Result<()> {
        if let Some(ref s) = self.c { w.write_with_tag(42, |w| w.write_message(s))?; }
        Ok(())
    }
}

#[derive(Debug, Default, PartialEq, Clone)]
pub struct E<'a> {
    pub video_id: Cow<'a, str>,
}

impl<'a> MessageRead<'a> for E<'a> {
    fn from_reader(r: &mut BytesReader, bytes: &'a [u8]) -> Result<Self> {
        let mut msg = Self::default();
        while !r.is_eof() {
            match r.next_tag(bytes) {
                Ok(10) => msg.video_id = r.read_string(bytes).map(Cow::Borrowed)?,
                Ok(t) => { r.read_unknown(bytes, t)?; }
                Err(e) => return Err(e),
            }
        }
        Ok(msg)
    }
}

impl<'a> MessageWrite for E<'a> {
    fn get_size(&self) -> usize {
        0
        + if self.video_id == "" { 0 } else { 1 + sizeof_len((&self.video_id).len()) }
    }

    fn write_message<W: WriterBackend>(&self, w: &mut Writer<W>) -> Result<()> {
        if self.video_id != "" { w.write_with_tag(10, |w| w.write_string(&**&self.video_id))?; }
        Ok(())
    }
}

#[derive(Debug, Default, PartialEq, Clone)]
pub struct F<'a> {
    pub e: Option<continuation::E<'a>>,
}

impl<'a> MessageRead<'a> for F<'a> {
    fn from_reader(r: &mut BytesReader, bytes: &'a [u8]) -> Result<Self> {
        let mut msg = Self::default();
        while !r.is_eof() {
            match r.next_tag(bytes) {
                Ok(389502058) => msg.e = Some(r.read_message::<continuation::E>(bytes)?),
                Ok(t) => { r.read_unknown(bytes, t)?; }
                Err(e) => return Err(e),
            }
        }
        Ok(msg)
    }
}

impl<'a> MessageWrite for F<'a> {
    fn get_size(&self) -> usize {
        0
        + self.e.as_ref().map_or(0, |m| 5 + sizeof_len((m).get_size()))
    }

    fn write_message<W: WriterBackend>(&self, w: &mut Writer<W>) -> Result<()> {
        if let Some(ref s) = self.e { w.write_with_tag(389502058, |w| w.write_message(s))?; }
        Ok(())
    }
}

#[derive(Debug, Default, PartialEq, Clone)]
pub struct Video<'a> {
    pub d: Option<continuation::D<'a>>,
    pub f: Option<continuation::F<'a>>,
    pub s4: i64,
}

impl<'a> MessageRead<'a> for Video<'a> {
    fn from_reader(r: &mut BytesReader, bytes: &'a [u8]) -> Result<Self> {
        let mut msg = Self::default();
        while !r.is_eof() {
            match r.next_tag(bytes) {
                Ok(10) => msg.d = Some(r.read_message::<continuation::D>(bytes)?),
                Ok(26) => msg.f = Some(r.read_message::<continuation::F>(bytes)?),
                Ok(32) => msg.s4 = r.read_int64(bytes)?,
                Ok(t) => { r.read_unknown(bytes, t)?; }
                Err(e) => return Err(e),
            }
        }
        Ok(msg)
    }
}

impl<'a> MessageWrite for Video<'a> {
    fn get_size(&self) -> usize {
        0
        + self.d.as_ref().map_or(0, |m| 1 + sizeof_len((m).get_size()))
        + self.f.as_ref().map_or(0, |m| 1 + sizeof_len((m).get_size()))
        + if self.s4 == 0i64 { 0 } else { 1 + sizeof_varint(*(&self.s4) as u64) }
    }

    fn write_message<W: WriterBackend>(&self, w: &mut Writer<W>) -> Result<()> {
        if let Some(ref s) = self.d { w.write_with_tag(10, |w| w.write_message(s))?; }
        if let Some(ref s) = self.f { w.write_with_tag(26, |w| w.write_message(s))?; }
        if self.s4 != 0i64 { w.write_with_tag(32, |w| w.write_int64(*&self.s4))?; }
        Ok(())
    }
}

