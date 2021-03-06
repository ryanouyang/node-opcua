/**
 * @module opcua.datamodel
 */
var factories = require("./../lib/misc/factories");
var ec = require("./../lib/misc/encode_decode");
var assert = require('better-assert');

var QualifiedName   = require("./../lib/datamodel/qualified_name").QualifiedName;
var LocalizedText   = require("./../lib/datamodel/localized_text").LocalizedText;

assert(QualifiedName, " expecting QualifiedName here to be defined");
assert(LocalizedText, " expecting Localized Text here to be defined");

var DiagnosticInfo_EncodingByte_Schema = {
    name: "DiagnosticInfo_EncodingByte",
    enumValues: {
        SymbolicId: 0x01,
        NamespaceUri: 0x02,
        LocalizedText: 0x04,
        Locale: 0x08,
        AdditionalInfo: 0x10,
        InnerStatusCode: 0x20,
        InnerDiagnosticInfo: 0x40
    }
};

var DiagnosticInfo_EncodingByte = exports.DiagnosticInfo_EncodingByte = factories.registerEnumeration(DiagnosticInfo_EncodingByte_Schema);



function getDiagnosticInfoEncodingByte(diagnosticInfo) {
    assert(diagnosticInfo);

    var encoding_mask = 0;

    if (diagnosticInfo.namespaceUri) {
        encoding_mask = set_flag(encoding_mask, DiagnosticInfo_EncodingByte.NamespaceUri);
    }
    if (diagnosticInfo.symbolicId) {
        encoding_mask = set_flag(encoding_mask, DiagnosticInfo_EncodingByte.SymbolicId);
    }
    if (diagnosticInfo.locale) {
        encoding_mask = set_flag(encoding_mask, DiagnosticInfo_EncodingByte.Locale);
    }
    if (diagnosticInfo.localizedText) {
        encoding_mask = set_flag(encoding_mask, DiagnosticInfo_EncodingByte.LocalizedText);
    }
    if (diagnosticInfo.additionalInfo) {
        encoding_mask = set_flag(encoding_mask, DiagnosticInfo_EncodingByte.AdditionalInfo);
    }
    if (diagnosticInfo.innerStatusCode !== null) {
        encoding_mask = set_flag(encoding_mask, DiagnosticInfo_EncodingByte.InnerStatusCode);
    }
    if (diagnosticInfo.innerDiagnosticInfo !== null) {
        encoding_mask = set_flag(encoding_mask, DiagnosticInfo_EncodingByte.InnerDiagnosticInfo);
    }
    return encoding_mask;
}

var set_flag = require("./../lib/misc/utils").set_flag;
var check_flag = require("./../lib/misc/utils").check_flag;


var DiagnosticInfo_Schema = {
    name: "DiagnosticInfo",
    fields: [
        { name: "namespaceUri",        fieldType: "Int32", defaultValue: null ,  documentation: "The symbolicId is defined within the context of a namespace."},
        { name: "symbolicId",          fieldType: "Int32", defaultValue: null , documentation : "The symbolicId shall be used to identify a vendor-specific error or condition"},
        { name: "locale",              fieldType: "Int32", defaultValue: null , documentation: "The locale part of the vendor-specific localized text describing the symbolic id."},
        { name: "localizedText",       fieldType: "Int32", defaultValue: null },
        { name: "additionalInfo",      fieldType: "String", defaultValue: null , documentation: "Vendor-specific diagnostic information."},
        { name: "innerStatusCode",     fieldType: "StatusCode", defaultValue: null, documentation: "The StatusCode from the inner operation."},
        { name: "innerDiagnosticInfo", fieldType: "DiagnosticInfo", defaultValue: null, documentation: "The diagnostic info associated with the inner StatusCode." }
    ],

    id:  25 ,

    encode: function (diagnosticInfo, stream) {

        var encoding_mask = getDiagnosticInfoEncodingByte(diagnosticInfo);

        // write encoding byte
        ec.encodeByte(encoding_mask, stream);

        // write symbolic id
        if (check_flag(encoding_mask, DiagnosticInfo_EncodingByte.SymbolicId)) {
            ec.encodeInt32(diagnosticInfo.symbolicId, stream);
        }
        // write namespace uri
        if (check_flag(encoding_mask, DiagnosticInfo_EncodingByte.NamespaceUri)) {
            ec.encodeInt32(diagnosticInfo.namespaceUri, stream);
        }
        // write locale
        if (check_flag(encoding_mask, DiagnosticInfo_EncodingByte.Locale)) {
            ec.encodeInt32(diagnosticInfo.locale, stream);
        }
        // write localized text
        if (check_flag(encoding_mask, DiagnosticInfo_EncodingByte.LocalizedText)) {
            ec.encodeInt32(diagnosticInfo.localizedText, stream);
        }
        // write additional info
        if (check_flag(encoding_mask, DiagnosticInfo_EncodingByte.AdditionalInfo)) {
            ec.encodeString(diagnosticInfo.additionalInfo, stream);
        }
        // write inner status code
        if (check_flag(encoding_mask, DiagnosticInfo_EncodingByte.InnerStatusCode)) {
            ec.encodeStatusCode(diagnosticInfo.innerStatusCode, stream);
        }
        // write  innerDiagnosticInfo
        if (check_flag(encoding_mask, DiagnosticInfo_EncodingByte.InnerDiagnosticInfo)) {
            assert(diagnosticInfo.innerDiagnosticInfo !== null && "missing innerDiagnosticInfo");
            diagnosticInfo.innerDiagnosticInfo.encode(stream);
        }
    },

    decode_debug: function (diagnosticInfo, stream, options) {

        var tracer = options.tracer;

        tracer.trace("start", options.name + "(" + "DiagnosticInfo" + ")", stream.length, stream.length);

        var cursor_before = stream.length;
        var encoding_mask = ec.decodeByte(stream);

        tracer.trace("member", "encodingByte", "0x" + encoding_mask.toString(16), cursor_before, stream.length, "Mask");
        cursor_before = stream.length;

        // read symbolic id
        if (check_flag(encoding_mask, DiagnosticInfo_EncodingByte.SymbolicId)) {
            diagnosticInfo.symbolicId = ec.decodeInt32(stream);
            tracer.trace("member", "symbolicId", diagnosticInfo.symbolicId, cursor_before, stream.length, "Int32");
            cursor_before = stream.length;
        }
        // read namespace uri
        if (check_flag(encoding_mask, DiagnosticInfo_EncodingByte.NamespaceUri)) {
            diagnosticInfo.namespaceUri = ec.decodeInt32(stream);
            tracer.trace("member", "symbolicId", diagnosticInfo.namespaceUri, cursor_before, stream.length, "Int32");
            cursor_before = stream.length;
        }
        // read locale
        if (check_flag(encoding_mask, DiagnosticInfo_EncodingByte.Locale)) {
            diagnosticInfo.locale = ec.decodeInt32(stream);
            tracer.trace("member", "locale", diagnosticInfo.locale, cursor_before, stream.length, "Int32");
            cursor_before = stream.length;
        }
        // read localized text
        if (check_flag(encoding_mask, DiagnosticInfo_EncodingByte.LocalizedText)) {
            diagnosticInfo.localizedText =  ec.decodeInt32(stream);
            tracer.trace("member", "localizedText", diagnosticInfo.localizedText, cursor_before, stream.length, "Int32");
            cursor_before = stream.length;
        }
        // read additional info
        if (check_flag(encoding_mask, DiagnosticInfo_EncodingByte.AdditionalInfo)) {
            diagnosticInfo.additionalInfo = ec.decodeString(stream);
            tracer.trace("member", "additionalInfo", diagnosticInfo.additionalInfo, cursor_before, stream.length, "String");
            cursor_before = stream.length;
        }
        // read inner status code
        if (check_flag(encoding_mask, DiagnosticInfo_EncodingByte.InnerStatusCode)) {
            diagnosticInfo.innerStatusCode = ec.decodeStatusCode(stream);
            tracer.trace("member", "innerStatusCode", diagnosticInfo.innerStatusCode, cursor_before, stream.length, "StatusCode");
            cursor_before = stream.length;
        }
        // read inner status code
        if (check_flag(encoding_mask, DiagnosticInfo_EncodingByte.InnerDiagnosticInfo)) {
            var DiagnosticInfo = require("../_generated_/_auto_generated_DiagnosticInfo").DiagnosticInfo;

            diagnosticInfo.innerDiagnosticInfo = new DiagnosticInfo({});

            diagnosticInfo.innerDiagnosticInfo.decode_debug(stream, options);
            tracer.trace("member", "innerDiagnosticInfo", diagnosticInfo.innerDiagnosticInfo, cursor_before, stream.length, "DiagnosticInfo");
        }

        tracer.trace("end", options.name, stream.length, stream.length);

    },

    decode: function (diagnosticInfo, stream, options) {

        var encoding_mask = ec.decodeByte(stream);

        // read symbolic id
        if (check_flag(encoding_mask, DiagnosticInfo_EncodingByte.SymbolicId)) {
            diagnosticInfo.symbolicId = ec.decodeInt32(stream);
        }
        // read namespace uri
        if (check_flag(encoding_mask, DiagnosticInfo_EncodingByte.NamespaceUri)) {
            diagnosticInfo.namespaceUri = ec.decodeInt32(stream);
        }
        // read locale
        if (check_flag(encoding_mask, DiagnosticInfo_EncodingByte.Locale)) {
            diagnosticInfo.locale = ec.decodeInt32(stream);
        }
        // read localized text
        if (check_flag(encoding_mask, DiagnosticInfo_EncodingByte.LocalizedText)) {
            diagnosticInfo.localizedText = ec.decodeInt32(stream);
        }
        // read additional info
        if (check_flag(encoding_mask, DiagnosticInfo_EncodingByte.AdditionalInfo)) {
            diagnosticInfo.additionalInfo = ec.decodeString(stream);
        }
        // read inner status code
        if (check_flag(encoding_mask, DiagnosticInfo_EncodingByte.InnerStatusCode)) {
            diagnosticInfo.innerStatusCode = ec.decodeStatusCode(stream);
        }
        // read inner status code
        if (check_flag(encoding_mask, DiagnosticInfo_EncodingByte.InnerDiagnosticInfo)) {

            var DiagnosticInfo = require("../_generated_/_auto_generated_DiagnosticInfo").DiagnosticInfo;
            diagnosticInfo.innerDiagnosticInfo = new DiagnosticInfo({});
            diagnosticInfo.innerDiagnosticInfo.decode(stream, options);
        }
    }
};
exports.DiagnosticInfo_Schema =DiagnosticInfo_Schema;

