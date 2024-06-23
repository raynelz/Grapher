//
//  Lark.js stand-alone parser
//===============================

"use strict";

import { parser, max, e } from 'mathjs';
//import {Error ,SyntaxError ,KeyError ,NotImplementedError} from '@failure-abstraction/error' ;
/**
	This is the main entrypoint into the generated Lark parser.

  @param {object} options An object with the following optional properties:

	  - transformer: an object of {rule: callback}, or an instance of Transformer
	  - propagate_positions (bool): should all tree nodes calculate line/column info?
	  - tree_class (Tree): a class that extends Tree, to be used for creating the parse tree.
	  - debug (bool): in case of error, should the parser output debug info to the console?

  @returns {Lark} an object which provides the following methods:

    - parse
    - parse_interactive
    - lex

*/
function get_parser(options = {}) {
  if (
    options.transformer &&
    options.transformer.constructor.name === "object"
  ) {
    options.transformer = Transformer.fromObj(options.transformer);
  }

  return Lark._load_from_dict({ data: DATA, memo: MEMO, ...options });
}

const NO_VALUE = {};
class _Decoratable {}
const Discard = {};
var bytes = require('bytes');
//
//   Implementation of Scanner + module emulation for Python's stdlib re
// -------------------------------------------------------------------------

const re = {
  escape(string) {
    // See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#escaping
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
  },
  compile(regex, flags) {
    // May throw re.error
    return new RegExp(regex, flags);
  },
  error: SyntaxError,
};

function _get_match(re_, regexp, s, flags) {
  const m = re_.compile(regexp, flags).exec(s);
  if (m != null) return m[0];
}

class Scanner {
  constructor(terminals, g_regex_flags, re_, use_bytes, match_whole = false) {
    this.terminals = terminals;
    this.g_regex_flags = g_regex_flags;
    this.re_ = re_;
    this.use_bytes = use_bytes;
    this.match_whole = match_whole;
    this.allowed_types = new Set(this.terminals.map((t) => t.name));

    this._regexps = this._build_mres(terminals);
  }

  _build_mres(terminals) {
    // TODO deal with priorities!
    let postfix = this.match_whole ? "$" : "";
    let patterns_by_flags = segment_by_key(terminals, (t) =>
      t.pattern.flags.join("")
    );

    let regexps = [];
    for (let [flags, patterns] of patterns_by_flags) {
      const pattern = patterns
        .map((t) => `(?<${t.name}>${t.pattern.to_regexp() + postfix})`)
        .join("|");
      regexps.push(new RegExp(pattern, this.g_regex_flags + flags + "y"));
    }

    return regexps;
  }

  match(text, pos) {
    for (const re of this._regexps) {
      re.lastIndex = pos;
      let m = re.exec(text);
      if (m) {
        // Find group. Ugly hack, but javascript is forcing my hand.
        let group = null;
        for (let [k, v] of Object.entries(m.groups)) {
          if (v) {
            group = k;
            break;
          }
        }
        return [m[0], group];
      }
    }
  }
}
//
//  Start of library code
// --------------------------

// const util = typeof require !== "undefined" && require("util");

class ABC {}

const NotImplemented = {};

function dict_items(d) {
  return Object.entries(d);
}
function dict_keys(d) {
  return Object.keys(d);
}
function dict_values(d) {
  return Object.values(d);
}

function dict_pop(d, key) {
  if (key === undefined) {
    key = Object.keys(d)[0];
  }
  let value = d[key];
  delete d[key];
  return value;
}

function dict_get(d, key, otherwise = null) {
  return d[key] || otherwise;
}

function dict_update(self, other) {
  if (self.constructor.name === "Map") {
    for (const [k, v] of dict_items(other)) {
      self.set(k, v);
    }
  } else {
    for (const [k, v] of dict_items(other)) {
      self[k] = v;
    }
  }
}

function make_constructor(cls) {
  return function () {
    return new cls(...arguments);
  };
}

function range(start, end) {
  if (end === undefined) {
    end = start;
    start = 0;
  }
  const res = [];
  for (let i = start; i < end; i++) res.push(i);
  return res;
}

function format(s) {
  let counter = 0;
  let args = [...arguments].slice(1);

  return s.replace(/%([sr])/g, function () {
    const t = arguments[1];
    const item = args[counter++];
    if (t === "r") {
      return JSON.stringify(item, null, 0);
    } else {
      return item;
    }
  });
}

function union(setA, setB) {
  let _union = new Set(setA);
  for (const elem of setB) {
    _union.add(elem);
  }
  return _union;
}

function intersection(setA, setB) {
  let _intersection = new Set();
  for (const elem of setB) {
    if (setA.has(elem)) {
      _intersection.add(elem);
    }
  }
  return _intersection;
}

function set_subtract(a, b) {
  return [...a].filter((e) => !b.has(e));
}

function dict(d) {
  return { ...d };
}

function bool(x) {
  return !!x;
}

function new_object(cls) {
  return Object.create(cls.prototype);
}

function copy(obj) {
  if (typeof obj == "object") {
    let empty_clone = Object.create(Object.getPrototypeOf(obj));
    return Object.assign(empty_clone, obj);
  }
  return obj;
}

function map_pop(key) {
  let value = this.get(key);
  this.delete(key);
  return value;
}

function hash(x) {
  return x;
}
function tuple(x) {
  return x;
}
function frozenset(x) {
  return new Set(x);
}

function is_dict(x) {
  return x && x.constructor.name === "Object";
}
function is_array(x) {
  return x && x.constructor.name === "Array";
}
function callable(x) {
  return typeof x === "function";
}

function* enumerate(it, start = 0) {
  // Taken from: https://stackoverflow.com/questions/34336960/what-is-the-es6-equivalent-of-python-enumerate-for-a-sequence
  let i = start;
  for (const x of it) {
    yield [i++, x];
  }
}

function any(lst) {
  for (const item of lst) {
    if (item) {
      return true;
    }
  }
  return false;
}

function all(lst) {
  for (const item of lst) {
    if (!item) {
      return false;
    }
  }
  return true;
}

function filter(pred, lst) {
  return lst.filter(pred || bool);
}

function partial(f) {
  let args = [...arguments].slice(1);
  return function () {
    return f(...args, ...arguments);
  };
}

class EOFError extends Error {}

function last_item(a) {
  return a[a.length - 1];
}

function callable_class(cls) {
  return function () {
    let inst = new cls(...arguments);
    return inst.__call__.bind(inst);
  };
}

function list_repeat(list, count) {
  return Array.from({ length: count }, () => list).flat();
}

function isupper(a) {
  return /^[A-Z_$]*$/.test(a);
}

function rsplit(s, delimiter, limit) {
  const arr = s.split(delimiter);
  return limit ? arr.splice(-limit - 1) : arr;
}

function str_count(s, substr) {
  let re = new RegExp(substr, "g");
  return (s.match(re) || []).length;
}

function list_count(list, elem) {
  let count = 0;
  for (const e of list) {
    if (e === elem) {
      count++;
    }
  }
  return count;
}

function isSubset(subset, set) {
  for (let elem of subset) {
    if (!set.has(elem)) {
      return false;
    }
  }
  return true;
}

function* segment_by_key(a, key) {
  let buffer = [];
  let last_k = null;
  for (const item of a) {
    const k = key(item);
    if (last_k && k != last_k) {
      yield [last_k, buffer];
      buffer = [];
    }
    buffer.push(item);
    last_k = k;
  }
  yield [last_k, buffer];
}

// --------------------------
//  End of library code
//

//
// Exceptions
//

class LarkError extends Error {
  // pass
}

class ConfigurationError extends LarkError {
  // pass
}

function assert_config(value, options, msg = "Got %r, expected one of %s") {
  if (!(options.includes(value))) {
    throw new ConfigurationError(format(msg, value, options));
  }
}

class GrammarError extends LarkError {
  // pass
}

class ParseError extends LarkError {
  // pass
}

class LexError extends LarkError {
  // pass
}

/**
  UnexpectedInput Error.

    Used as a base class for the following exceptions:

    - ``UnexpectedCharacters``: The lexer encountered an unexpected string
    - ``UnexpectedToken``: The parser received an unexpected token
    - ``UnexpectedEOF``: The parser expected a token, but the input ended

    After catching one of these exceptions, you may call the following helper methods to create a nicer error message.

*/

class UnexpectedInput extends LarkError {
  pos_in_stream = null;
  _terminals_by_name = null;
  /**
    Returns a pretty string pinpointing the error in the text,
        with span amount of context characters around it.

        Note:
            The parser doesn't hold a copy of the text it has to parse,
            so you have to provide it again

  */
  get_context(text, span = 40) {
    let after, before;
    let pos = this.pos_in_stream;
    let start = max(pos - span, 0);
    let end = pos + span;
    if (!(text instanceof bytes)) {
      before = last_item(rsplit(text.slice(start, pos), "\n", 1));
      after = text.slice(pos, end).split("\n", 1)[0];
      return before + after + "\n" + " " * before.expandtabs().length + "^\n";
    } else {
      before = last_item(rsplit(text.slice(start, pos), "\n", 1));
      after = text.slice(pos, end).split("\n", 1)[0];
      return (
        before +
        after +
        "\n" +
        " " * before.expandtabs().length +
        "^\n"
      ).decode("ascii", "backslashreplace");
    }
  }

  /**
    Allows you to detect what's wrong in the input text by matching
        against example errors.

        Given a parser instance and a dictionary mapping some label with
        some malformed syntax examples, it'll return the label for the
        example that bests matches the current error. The function will
        iterate the dictionary until it finds a matching error, and
        return the corresponding value.

        For an example usage, see `examples/error_reporting_lalr.py`

        Parameters:
            parse_fn: parse function (usually ``lark_instance.parse``)
            examples: dictionary of ``{'example_string': value}``.
            use_accepts: Recommended to keep this as ``use_accepts=True``.

  */
  match_examples(
    parse_fn,
    examples,
    token_type_match_fallback = false,
  ) {
    if (is_dict(examples)) {
      examples = dict_items(examples);
    }

    let candidate = [null, false];
    for (const [i, [label, example]] of enumerate(examples)) {
      for (const [j, malformed] of enumerate(example)) {
        try {
          parse_fn(malformed);
        } catch (ut) {
          if (ut instanceof UnexpectedInput) {
            if (ut.state.eq(this.state)) {
                if (ut.token === this.token) {
                  return label;
                }

                if (token_type_match_fallback) {
                  // Fallback to token types match
                  if (
                    ut.token.type === this.token.type &&
                    !last_item(candidate)
                  ) {
                    candidate = [label, true];
                  }
                }
              if (candidate[0] === null) {
                candidate = [label, false];
              }
            }
          } else {
            throw ut;
          }
        }
      }
    }

    return candidate[0];
  }

  _format_expected(expected) {
    let d;
    if (this._terminals_by_name) {
      d = this._terminals_by_name;
      expected = expected.map((t_name) =>
        t_name in d ? d[t_name].user_repr() : t_name
      );
    }

    return format("Expected one of: \n\t* %s\n", expected.join("\n\t* "));
  }
}

/**
  An exception that is raised by the parser, when the input ends while it still expects a token.

*/

class UnexpectedEOF extends UnexpectedInput {
  constructor(expected, state = null, terminals_by_name = null) {
    super();
    this.expected = expected;
    this.state = state;
    this.token = new Token("<EOF>", "");
    // , line=-1, column=-1, pos_in_stream=-1)
    this.pos_in_stream = -1;
    this.line = -1;
    this.column = -1;
    this._terminals_by_name = terminals_by_name;
  }
}

/**
  An exception that is raised by the lexer, when it cannot match the next
    string of characters to any of its terminals.

*/

class UnexpectedCharacters extends UnexpectedInput {
  constructor({
    seq,
    lex_pos,
    line,
    column,
    allowed = null,
    considered_tokens = null,
    state = null,
    token_history = null,
    terminals_by_name = null,
    considered_rules = null,
  } = {}) {
    super();
    // TODO considered_tokens and allowed can be figured out using state
    this.line = line;
    this.column = column;
    this.pos_in_stream = lex_pos;
    this.state = state;
    this._terminals_by_name = terminals_by_name;
    this.allowed = allowed;
    this.considered_tokens = considered_tokens;
    this.considered_rules = considered_rules;
    this.token_history = token_history;
      this.char = seq[lex_pos];
    // this._context = this.get_context(seq);
  }
}

/**
  An exception that is raised by the parser, when the token it received
    doesn't match any valid step forward.

    Parameters:
        token: The mismatched token
        expected: The set of expected tokens
        considered_rules: Which rules were considered, to deduce the expected tokens
        state: A value representing the parser state. Do not rely on its value or type.
        interactive_parser: An instance of ``InteractiveParser``, that is initialized to the point of failture,
                            and can be used for debugging and error handling.

    Note: These parameters are available as attributes of the instance.

*/

class UnexpectedToken extends UnexpectedInput {
  constructor({
    token,
    expected,
    considered_rules = null,
    state = null,
    interactive_parser = null,
    terminals_by_name = null,
    token_history = null,
  } = {}) {
    super();
    // TODO considered_rules and expected can be figured out using state
    this.line = (token && token["line"]) || "?";
    this.column = (token && token["column"]) || "?";
    this.pos_in_stream = (token && token["start_pos"]) || null;
    this.state = state;
    this.token = token;
    this.expected = expected;
    // XXX deprecate? `accepts` is better
    this._accepts = NO_VALUE;
    this.considered_rules = considered_rules;
    this.interactive_parser = interactive_parser;
    this._terminals_by_name = terminals_by_name;
    this.token_history = token_history;
  }

  get accepts() {
    if (this._accepts === NO_VALUE) {
      this._accepts =
        this.interactive_parser && this.interactive_parser.accepts();
    }

    return this._accepts;
  }
}

/**
  VisitError is raised when visitors are interrupted by an exception

    It provides the following attributes for inspection:

    Parameters:
        rule: the name of the visit rule that failed
        obj: the tree-node or token that was being processed
        orig_exc: the exception that cause it to fail

    Note: These parameters are available as attributes

*/

class VisitError extends LarkError {
  constructor(rule, obj, orig_exc) {
    let message = format(
      'Error trying to process rule "%s":\n\n%s',
      rule,
      orig_exc
    );
    super(message);
    this.rule = rule;
    this.obj = obj;
    this.orig_exc = orig_exc;
  }
}

//
// Utils
//

function classify(seq, key = null, value = null) {
  let k, v;
  let d = new Map();
  for (const item of seq) {
    k = key !== null ? key(item) : item;
    v = value !== null ? value(item) : item;
    if (d.has(k)) {
      d.get(k).push(v);
    } else {
      d.set(k, [v]);
    }
  }

  return d;
}

function _deserialize(data, namespace, memo) {
  let class_;
  if (is_dict(data)) {
    if ("__type__" in data) {
      // Object
      class_ = namespace[data["__type__"]];
      return class_.deserialize(data, memo);
    } else if ("@" in data) {
      return memo[data["@"]];
    }

    return Object.fromEntries(
      dict_items(data).map(([key, value]) => [
        key,
        _deserialize(value, namespace, memo),
      ])
    );
  } else if (is_array(data)) {
    return data.map((value) => _deserialize(value, namespace, memo));
  }

  return data;
}

/**
  Safe-ish serialization interface that doesn't rely on Pickle

    Attributes:
        __serialize_fields__ (List[str]): Fields (aka attributes) to serialize.
        __serialize_namespace__ (list): List of classes that deserialization is allowed to instantiate.
                                        Should include all field types that aren't builtin types.

*/

class Serialize {
  static deserialize(data, memo) {
    const cls = this;
    let fields = cls && cls["__serialize_fields__"];
    if ("@" in data) {
      return memo[data["@"]];
    }

    let inst = new_object(cls);
    for (const f of fields) {
      if (data && f in data) {
        inst[f] = _deserialize(data[f], NAMESPACE, memo);
      } else {
        throw new KeyError("Cannot find key for class", cls, e);
      }
    }

    if ("_deserialize" in inst) {
      inst._deserialize();
    }

    return inst;
  }
}

/**
  A version of serialize that memoizes objects to reduce space
*/

class SerializeMemoizer extends Serialize {
  static get __serialize_fields__() {
    return ["memoized"];
  }
  constructor(types_to_memoize) {
    super();
    this.types_to_memoize = tuple(types_to_memoize);
    this.memoized = new Enumerator();
  }

  in_types(value) {
    return value instanceof this.types_to_memoize;
  }

  serialize() {
    return _serialize(this.memoized.reversed(), null);
  }

  static deserialize(data, namespace, memo) {
    const cls = this;
    return _deserialize(data, namespace, memo);
  }
}

//
// Tree
//

class Meta {
  constructor() {
    this.empty = true;
  }
}

/**
  The main tree class.

    Creates a new tree, and stores "data" and "children" in attributes of the same name.
    Trees can be hashed and compared.

    Parameters:
        data: The name of the rule or alias
        children: List of matched sub-rules and terminals
        meta: Line & Column numbers (if ``propagate_positions`` is enabled).
            meta attributes: line, column, start_pos, end_line, end_column, end_pos

*/

class Tree {
  constructor(data, children, meta = null) {
    this.data = data;
    this.children = children;
    this._meta = meta;
  }

  get meta() {
    if (this._meta === null) {
      this._meta = new Meta();
    }

    return this._meta;
  }

  repr() {
    return format("Tree(%r, %r)", this.data, this.children);
  }

  _pretty_label() {
    return this.data;
  }

  _pretty(level, indent_str) {
    if (this.children.length === 1 && !(this.children[0] instanceof Tree)) {
      return [
        list_repeat(indent_str, level).join(''),
        this._pretty_label(),
        "\t",
        format("%s", this.children[0].value),
        "\n",
      ];
    }

    let l = [list_repeat(indent_str, level).join(''), this._pretty_label(), "\n"];
    for (const n of this.children) {
      if (n instanceof Tree) {
        l.push(...n._pretty(level + 1, indent_str));
      } else {
        l.push(...[list_repeat(indent_str, level+1).join(''), format("%s", n.value), "\n"]);
      }
    }

    return l;
  }

  /**
    Returns an indented string representation of the tree.

        Great for debugging.

  */
  pretty(indent_str = "  ") {
    return this._pretty(0, indent_str).join("");
  }

  eq(other) {
    if (
      other &&
      this &&
      other &&
      this &&
      other.children &&
      this.children &&
      other.data &&
      this.data
    ) {
      return this.data === other.data && this.children === other.children;
    } else {
      return false;
    }
  }

  /**
    Depth-first iteration.

        Iterates over all the subtrees, never returning to the same node twice (Lark's parse-tree is actually a DAG).

  */
  iter_subtrees() {
    let queue = [this];
    let subtrees = new Map();
    for (const subtree of queue) {
      subtrees.set(subtree, subtree);
      queue.push(
        ...[...subtree.children]
          .reverse()
          .filter((c) => c instanceof Tree && !subtrees.has(c))
          .map((c) => c)
      );
    }

    queue = undefined;
    return [...subtrees.values()].reverse();
  }

  /**
    Returns all nodes of the tree that evaluate pred(node) as true.
  */
  find_pred(pred) {
    return filter(pred, this.iter_subtrees());
  }

  /**
    Returns all nodes of the tree whose data equals the given data.
  */
  find_data(data) {
    return this.find_pred((t) => t.data === data);
  }


  /**
    Return all values in the tree that evaluate pred(value) as true.

        This can be used to find all the tokens in the tree.

        Example:
            >>> all_tokens = tree.scan_values(lambda v: isinstance(v, Token))

  */
  *scan_values(pred) {
    for (const c of this.children) {
      if (c instanceof Tree) {
        for (const t of c.scan_values(pred)) {
          yield t;
        }
      } else {
        if (pred(c)) {
          yield c;
        }
      }
    }
  }

  /**
    Breadth-first iteration.

        Iterates over all the subtrees, return nodes in order like pretty() does.

  */
  *iter_subtrees_topdown() {
    let node;
    let stack = [this];
    while (stack.length) {
      node = stack.pop();
      if (!(node instanceof Tree)) {
        continue;
      }

      yield node;
      for (const child of [...node.children].reverse()) {
        stack.push(child);
      }
    }
  }

  copy() {
    return type(this)(this.data, this.children);
  }

  set(data, children) {
    this.data = data;
    this.children = children;
  }
}

//
// Visitors
//

/**
  Transformers work bottom-up (or depth-first), starting with visiting the leaves and working
    their way up until ending at the root of the tree.

    For each node visited, the transformer will call the appropriate method (callbacks), according to the
    node's ``data``, and use the returned value to replace the node, thereby creating a new tree structure.

    Transformers can be used to implement map & reduce patterns. Because nodes are reduced from leaf to root,
    at any point the callbacks may assume the children have already been transformed (if applicable).

    If the transformer cannot find a method with the right name, it will instead call ``__default__``, which by
    default creates a copy of the node.

    To discard a node, return Discard (``lark.visitors.Discard``).

    ``Transformer`` can do anything ``Visitor`` can do, but because it reconstructs the tree,
    it is slightly less efficient.

    A transformer without methods essentially performs a non-memoized partial deepcopy.

    All these classes implement the transformer interface:

    - ``Transformer`` - Recursively transforms the tree. This is the one you probably want.
    - ``Transformer_InPlace`` - Non-recursive. Changes the tree in-place instead of returning new instances
    - ``Transformer_InPlaceRecursive`` - Recursive. Changes the tree in-place instead of returning new instances

    Parameters:
        visit_tokens (bool, optional): Should the transformer visit tokens in addition to rules.
                                       Setting this to ``False`` is slightly faster. Defaults to ``True``.
                                       (For processing ignored tokens, use the ``lexer_callbacks`` options)


*/

class Transformer extends _Decoratable {
  static get __visit_tokens__() {
    return true;
  }
  // For backwards compatibility

  constructor(visit_tokens = true) {
    super();
    this.__visit_tokens__ = visit_tokens;
  }

  static fromObj(obj, ...args) {
    class _T extends this {}
    for (let [k, v] of Object.entries(obj)) {
      _T.prototype[k] = v
    }
    return new _T(...args)
  }

  _call_userfunc(tree, new_children = null) {
    let f, wrapper;
    // Assumes tree is already transformed
    let children = new_children !== null ? new_children : tree.children;
    if (tree && tree.data && this && this[tree.data]) {
      f = this && this[tree.data];
      try {
        wrapper = (f && f["visit_wrapper"]) || null;
        if (wrapper !== null) {
          return f.visit_wrapper(f, tree.data, children, tree.meta);
        } else {
          return f(children);
        }
      } catch (e) {
        if (e instanceof GrammarError) {
          throw e;
        } else if (e instanceof Error) {
          throw new VisitError(tree.data, tree, e);
        } else {
          throw e;
        }
      }
    } else {
      return this.__default__(tree.data, children, tree.meta);
    }
  }

  _call_userfunc_token(token) {
    let f;
    if (token && token.type && this && this[token.type]) {
      f = this && this[token.type];
      try {
        return f(token);
      } catch (e) {
        if (e instanceof GrammarError) {
          throw e;
        } else if (e instanceof Error) {
          throw new VisitError(token.type, token, e);
        } else {
          throw e;
        }
      }
    } else {
      return this.__default_token__(token);
    }
  }

  *_transform_children(children) {
    let res;
    for (const c of children) {
      if (c instanceof Tree) {
        res = this._transform_tree(c);
      } else if (this.__visit_tokens__ && c instanceof Token) {
        res = this._call_userfunc_token(c);
      } else {
        res = c;
      }
      if (res !== Discard) {
        yield res;
      }
    }
  }

  _transform_tree(tree) {
    let children = [...this._transform_children(tree.children)];
    return this._call_userfunc(tree, children);
  }

  /**
    Transform the given tree, and return the final result
  */
  transform(tree) {
    return this._transform_tree(tree);
  }

  /**
    Default function that is called if there is no attribute matching ``data``

        Can be overridden. Defaults to creating a new copy of the tree node (i.e. ``return Tree(data, children, meta)``)

  */
  __default__(data, children, meta) {
    return new Tree(data, children, meta);
  }

  /**
    Default function that is called if there is no attribute matching ``token.type``

        Can be overridden. Defaults to returning the token as-is.

  */
  __default_token__(token) {
    return token;
  }
}

/**
  Same as Transformer, but non-recursive, and changes the tree in-place instead of returning new instances

    Useful for huge trees. Conservative in memory.

*/

class Transformer_InPlace extends Transformer {
  _transform_tree(tree) {
    // Cancel recursion
    return this._call_userfunc(tree);
  }

  transform(tree) {
    for (const subtree of tree.iter_subtrees()) {
      subtree.children = [...this._transform_children(subtree.children)];
    }

    return this._transform_tree(tree);
  }
}

/**
  Same as Transformer but non-recursive.

    Like Transformer, it doesn't change the original tree.

    Useful for huge trees.

*/

class Transformer_NonRecursive extends Transformer {
  transform(tree) {
    let args, res, size;
    // Tree to postfix
    let rev_postfix = [];
    let q = [tree];
    while (q.length) {
      const t = q.pop();
      rev_postfix.push(t);
      if (t instanceof Tree) {
        q.push(...t.children);
      }
    }

    // Postfix to tree
    let stack = [];
    for (const x of [...rev_postfix].reverse()) {
      if (x instanceof Tree) {
        size = x.children.length;
        if (size) {
          args = stack.slice(-size);
          stack.splice(-size);
        } else {
          args = [];
        }
        res = this._call_userfunc(x, args);
        if (res !== Discard) {
          stack.push(res);
        }
      } else if (this.__visit_tokens__ && x instanceof Token) {
        res = this._call_userfunc_token(x);
        if (res !== Discard) {
          stack.push(res);
        }
      } else {
        stack.push(x);
      }
    }

    let [t] = stack;
    // We should have only one tree remaining
    return t;
  }
}

/**
  Same as Transformer, recursive, but changes the tree in-place instead of returning new instances
*/

class Transformer_InPlaceRecursive extends Transformer {
  _transform_tree(tree) {
    tree.children = [...this._transform_children(tree.children)];
    return this._call_userfunc(tree);
  }
}

// Visitors

class VisitorBase {
  _call_userfunc(tree) {
    const callback = this[tree.data]
    if (callback) {
      return callback(tree)
    } else {
      return this.__default__(tree);
    }
  }

  /**
    Default function that is called if there is no attribute matching ``tree.data``

        Can be overridden. Defaults to doing nothing.

  */
  __default__(tree) {
    return tree;
  }

  __class_getitem__(_) {
    return cls;
  }
}

/**
  Tree visitor, non-recursive (can handle huge trees).

    Visiting a node calls its methods (provided by the user via inheritance) according to ``tree.data``

*/

class Visitor extends VisitorBase {
  /**
    Visits the tree, starting with the leaves and finally the root (bottom-up)
  */
  visit(tree) {
    for (const subtree of tree.iter_subtrees()) {
      this._call_userfunc(subtree);
    }

    return tree;
  }

  /**
    Visit the tree, starting at the root, and ending at the leaves (top-down)
  */
  visit_topdown(tree) {
    for (const subtree of tree.iter_subtrees_topdown()) {
      this._call_userfunc(subtree);
    }

    return tree;
  }
}

/**
  Bottom-up visitor, recursive.

    Visiting a node calls its methods (provided by the user via inheritance) according to ``tree.data``

    Slightly faster than the non-recursive version.

*/

class Visitor_Recursive extends VisitorBase {
  /**
    Visits the tree, starting with the leaves and finally the root (bottom-up)
  */
  visit(tree) {
    for (const child of tree.children) {
      if (child instanceof Tree) {
        this.visit(child);
      }
    }

    this._call_userfunc(tree);
    return tree;
  }

  /**
    Visit the tree, starting at the root, and ending at the leaves (top-down)
  */
  visit_topdown(tree) {
    this._call_userfunc(tree);
    for (const child of tree.children) {
      if (child instanceof Tree) {
        this.visit_topdown(child);
      }
    }

    return tree;
  }
}

/**
  Interpreter walks the tree starting at the root.

    Visits the tree, starting with the root and finally the leaves (top-down)

    For each tree node, it calls its methods (provided by user via inheritance) according to ``tree.data``.

    Unlike ``Transformer`` and ``Visitor``, the Interpreter doesn't automatically visit its sub-branches.
    The user has to explicitly call ``visit``, ``visit_children``, or use the ``@visit_children_decor``.
    This allows the user to implement branching and loops.

*/

class Interpreter extends _Decoratable {
  visit(tree) {
    if (tree.data in this) {
      return this[tree.data](tree);
    } else {
      return this.__default__(tree)
    }
  }

  visit_children(tree) {
    return tree.children.map((child) =>
      child instanceof Tree ? this.visit(child) : child
    );
  }

  __default__(tree) {
    return this.visit_children(tree);
  }
}

//
// Grammar
//

var TOKEN_DEFAULT_PRIORITY = 0;
class Symbol extends Serialize {
  is_term = NotImplemented;
  constructor(name) {
    super();
    this.name = name;
  }

  eq(other) {
    return this.is_term === other.is_term && this.name === other.name;
  }

  repr() {
    return format("%s(%r)", type(this).name, this.name);
  }

  static get fullrepr() {
    return property(__repr__);
  }
  get fullrepr() {
    return this.constructor.fullrepr;
  }
  renamed(f) {
    return type(this)(f(this.name));
  }
}

class Terminal extends Symbol {
  static get __serialize_fields__() {
    return ["name", "filter_out"];
  }
  get is_term() {
    return true
  }

  constructor(name, filter_out = false) {
    super();
    this.name = name;
    this.filter_out = filter_out;
  }

  get fullrepr() {
    return format("%s(%r, %r)", type(this).name, this.name, this.filter_out);
  }

  renamed(f) {
    return type(this)(f(this.name), this.filter_out);
  }
}

class NonTerminal extends Symbol {
  static get __serialize_fields__() {
    return ["name"];
  }
  get is_term() {
    return false
  }

}

class RuleOptions extends Serialize {
  static get __serialize_fields__() {
    return [
      "keep_all_tokens",
      "expand1",
      "priority",
      "template_source",
      "empty_indices",
    ];
  }
  constructor(
    keep_all_tokens = false,
    expand1 = false,
    priority = null,
    template_source = null,
    empty_indices = []
  ) {
    super();
    this.keep_all_tokens = keep_all_tokens;
    this.expand1 = expand1;
    this.priority = priority;
    this.template_source = template_source;
    this.empty_indices = empty_indices;
  }

  repr() {
    return format(
      "RuleOptions(%r, %r, %r, %r)",
      this.keep_all_tokens,
      this.expand1,
      this.priority,
      this.template_source
    );
  }
}

/**

        origin : a symbol
        expansion : a list of symbols
        order : index of this expansion amongst all rules of the same name

*/

class Rule extends Serialize {
  static get __serialize_fields__() {
    return ["origin", "expansion", "order", "alias", "options"];
  }
  static get __serialize_namespace__() {
    return [Terminal, NonTerminal, RuleOptions];
  }
  constructor(origin, expansion, order = 0, alias = null, options = null) {
    super();
    this.origin = origin;
    this.expansion = expansion;
    this.alias = alias;
    this.order = order;
    this.options = options || new RuleOptions();
    this._hash = hash([this.origin, tuple(this.expansion)]);
  }

  _deserialize() {
    this._hash = hash([this.origin, tuple(this.expansion)]);
  }

  repr() {
    return format(
      "Rule(%r, %r, %r, %r)",
      this.origin,
      this.expansion,
      this.alias,
      this.options
    );
  }

  eq(other) {
    if (!(other instanceof Rule)) {
      return false;
    }

    return this.origin === other.origin && this.expansion === other.expansion;
  }
}

//
// Lexer
//

// Lexer Implementation

class Pattern extends Serialize {
  constructor(value, flags = [], raw = null) {
    super();
    this.value = value;
    this.flags = frozenset(flags);
    this.raw = raw;
  }

  repr() {
    return repr(this.to_regexp());
  }

  eq(other) {
    return (
      type(this) === type(other) &&
      this.value === other.value &&
      this.flags === other.flags
    );
  }

  to_regexp() {
    throw new NotImplementedError();
  }

  get min_width() {
    throw new NotImplementedError();
  }

  get max_width() {
    throw new NotImplementedError();
  }

  _get_flags(value) {
    return value;
  }
}

class PatternStr extends Pattern {
  static get __serialize_fields__() {
    return ["value", "flags"];
  }
  static get type() { return "str"; }
  to_regexp() {
    return this._get_flags(re.escape(this.value));
  }

  get min_width() {
    return this.value.length;
  }

  get max_width() {
    return this.value.length;
  }
}

class PatternRE extends Pattern {
  static get __serialize_fields__() {
    return ["value", "flags", "_width"];
  }
  static get type() { return "re"; }
  to_regexp() {
    return this._get_flags(this.value);
  }

  _get_width() {
    if (this._width === null) {
      this._width = get_regexp_width(this.to_regexp());
    }

    return this._width;
  }

  get min_width() {
    return this._get_width()[0];
  }

  get max_width() {
    return this._get_width()[1];
  }
}

class TerminalDef extends Serialize {
  static get __serialize_fields__() {
    return ["name", "pattern", "priority"];
  }
  static get __serialize_namespace__() {
    return [PatternStr, PatternRE];
  }
  constructor(name, pattern, priority = TOKEN_DEFAULT_PRIORITY) {
    super();
    this.name = name;
    this.pattern = pattern;
    this.priority = priority;
  }

  repr() {
    return format("%s(%r, %r)", type(this).name, this.name, this.pattern);
  }

  user_repr() {
    if (this.name.startsWith("__")) {
      // We represent a generated terminal
      return this.pattern.raw || this.name;
    } else {
      return this.name;
    }
  }
}

/**
  A string with meta-information, that is produced by the lexer.

    When parsing text, the resulting chunks of the input that haven't been discarded,
    will end up in the tree as Token instances. The Token class inherits from Python's ``str``,
    so normal string comparisons and operations will work as expected.

    Attributes:
        type: Name of the token (as specified in grammar)
        value: Value of the token (redundant, as ``token.value == token`` will always be true)
        start_pos: The index of the token in the text
        line: The line of the token in the text (starting with 1)
        column: The column of the token in the text (starting with 1)
        end_line: The line where the token ends
        end_column: The next column after the end of the token. For example,
            if the token is a single character with a column value of 4,
            end_column will be 5.
        end_pos: the index where the token ends (basically ``start_pos + len(token)``)

*/

class Token {
  constructor(
    type_,
    value,
    start_pos = null,
    line = null,
    column = null,
    end_line = null,
    end_column = null,
    end_pos = null
  ) {
    this.type = type_;
    this.start_pos = start_pos;
    this.value = value;
    this.line = line;
    this.column = column;
    this.end_line = end_line;
    this.end_column = end_column;
    this.end_pos = end_pos;
  }

  update(type_ = null, value = null) {
    return Token.new_borrow_pos(
      type_ !== null ? type_ : this.type,
      value !== null ? value : this.value,
      this
    );
  }

  static new_borrow_pos(type_, value, borrow_t) {
    const cls = this;
    return new cls(
      type_,
      value,
      borrow_t.start_pos,
      borrow_t.line,
      borrow_t.column,
      borrow_t.end_line,
      borrow_t.end_column,
      borrow_t.end_pos
    );
  }

  repr() {
    return format("Token(%r, %r)", this.type, this.value);
  }

  eq(other) {
    if (other instanceof Token && this.type !== other.type) {
      return false;
    }

    return str.__eq__(this, other);
  }

  static get __hash__() {
    return str.__hash__;
  }
}

class LineCounter {
  constructor(newline_char) {
    this.newline_char = newline_char;
    this.char_pos = 0;
    this.line = 1;
    this.column = 1;
    this.line_start_pos = 0;
  }

  eq(other) {
    if (!(other instanceof LineCounter)) {
      return NotImplemented;
    }

    return (
      this.char_pos === other.char_pos &&
      this.newline_char === other.newline_char
    );
  }

  /**
    Consume a token and calculate the new line & column.

        As an optional optimization, set test_newline=False if token doesn't contain a newline.

  */
  feed(token, test_newline = true) {
    let newlines;
    if (test_newline) {
      newlines = str_count(token, this.newline_char);
      if (newlines) {
        this.line += newlines;
        this.line_start_pos =
          this.char_pos + token.lastIndexOf(this.newline_char) + 1;
      }
    }

    this.char_pos += token.length;
    this.column = this.char_pos - this.line_start_pos + 1;
  }
}

class _UnlessCallback {
  constructor(scanner) {
    this.scanner = scanner;
  }

  __call__(t) {
    let _value;
    let res = this.scanner.match(t.value, 0);
    if (res) {
      [_value, t.type] = res;
    }

    return t;
  }
}

const UnlessCallback = callable_class(_UnlessCallback);
class _CallChain {
  constructor(callback1, callback2, cond) {
    this.callback1 = callback1;
    this.callback2 = callback2;
    this.cond = cond;
  }

  __call__(t) {
    let t2 = this.callback1(t);
    return this.cond(t2) ? this.callback2(t) : t2;
  }
}

const CallChain = callable_class(_CallChain);
function _create_unless(terminals, g_regex_flags, re_, use_bytes) {
  let s, unless;
  let tokens_by_type = classify(terminals, (t) => t.pattern.constructor.type);
  let embedded_strs = new Set();
  let callback = {};
  for (const retok of tokens_by_type.get('re') || []) {
    unless = [];
    for (const strtok of tokens_by_type.get('str') || []) {
      if (strtok.priority !== retok.priority) {
        continue;
      }

      s = strtok.pattern.value;
      if (s === _get_match(re_, retok.pattern.to_regexp(), s, g_regex_flags)) {
        unless.push(strtok);
        if (isSubset(new Set(strtok.pattern.flags), new Set(retok.pattern.flags))) {
          embedded_strs.add(strtok);
        }
      }
    }

    if (unless.length) {
      callback[retok.name] = new UnlessCallback(
        new Scanner(
          unless,
          g_regex_flags,
          re_,
          use_bytes,
          true,
        ),
      );
    }
  }

  let new_terminals = terminals
    .filter((t) => !embedded_strs.has(t))
    .map((t) => t);
  return [new_terminals, callback];
}

/**
    Expressions that may indicate newlines in a regexp:
        - newlines (\n)
        - escaped newline (\\n)
        - anything but ([^...])
        - any-char (.) when the flag (?s) exists
        - spaces (\s)

  */
function _regexp_has_newline(r) {
  return (
    r.includes("\n") ||
    r.includes("\\n") ||
    r.includes("\\s") ||
    r.includes("[^") ||
    (r.includes("(?s") && r.includes("."))
  );
}

/**
  Represents the current state of the lexer as it scans the text
    (Lexer objects are only instanciated per grammar, not per text)

*/

class LexerState {
  constructor(text, line_ctr = null, last_token = null) {
    this.text = text;
    this.line_ctr = line_ctr || new LineCounter("\n");
    this.last_token = last_token;
  }

  eq(other) {
    if (!(other instanceof LexerState)) {
      return NotImplemented;
    }

    return (
      this.text === other.text &&
      this.line_ctr === other.line_ctr &&
      this.last_token === other.last_token
    );
  }
}

/**
  A thread that ties a lexer instance and a lexer state, to be used by the parser

*/

class LexerThread {
  constructor(lexer, lexer_state) {
    this.lexer = lexer;
    this.state = lexer_state;
  }

  static from_text(lexer, text) {
    return new this(lexer, new LexerState(text));
  }

  lex(parser_state) {
    return this.lexer.lex(this.state, parser_state);
  }
}

/**
  Lexer interface

    Method Signatures:
        lex(self, lexer_state, parser_state) -> Iterator[Token]

*/

class Lexer extends ABC {
  lex(lexer_state, parser_state) {
    return NotImplemented;
  }
}

function sort_by_key_tuple(arr, key) {
  arr.sort( (a, b) => {
    let ta = key(a)
    let tb = key(b)
    for (let i=0; i<ta.length; i++) {
      if (ta[i] > tb[i]) {
        return 1;
      }
      else if (ta[i] < tb[i]) {
        return -1;
      }
    }
    return 0;
  })
}


class BasicLexer extends Lexer {
  constructor(conf) {
    super();
    let terminals = [...conf.terminals];
    this.re = conf.re_module;
    if (!conf.skip_validation) {
      // Sanitization
      for (const t of terminals) {
        try {
          this.re.compile(t.pattern.to_regexp(), conf.g_regex_flags);
        } catch (e) {
          if (e instanceof this.re.error) {
            throw new LexError(
              format("Cannot compile token %s: %s", t.name, t.pattern)
            );
          } else {
            throw e;
          }
        }
        if (t.pattern.min_width === 0) {
          throw new LexError(
            format(
              "Lexer does not allow zero-width terminals. (%s: %s)",
              t.name,
              t.pattern
            )
          );
        }
      }

      if (!(new Set(conf.ignore) <= new Set(terminals.map((t) => t.name)))) {
        throw new LexError(
          format(
            "Ignore terminals are not defined: %s",
            set_subtract(
              new Set(conf.ignore),
              new Set(terminals.map((t) => t.name))
            )
          )
        );
      }
    }

    // Init
    this.newline_types = frozenset(
      terminals
        .filter((t) => _regexp_has_newline(t.pattern.to_regexp()))
        .map((t) => t.name)
    );
    this.ignore_types = frozenset(conf.ignore);
    sort_by_key_tuple(terminals, (x) => [
        -x.priority,
        -x.pattern.max_width,
        -x.pattern.value.length,
        x.name,
    ]);
    this.terminals = terminals;
    this.user_callbacks = conf.callbacks;
    this.g_regex_flags = conf.g_regex_flags;
    this.use_bytes = conf.use_bytes;
    this.terminals_by_name = conf.terminals_by_name;
    this._scanner = null;
  }

  _build_scanner() {
    let terminals;
    [terminals, this.callback] = _create_unless(
      this.terminals,
      this.g_regex_flags,
      this.re,
      this.use_bytes
    );
    for (const [type_, f] of dict_items(this.user_callbacks)) {
      if (type_ in this.callback) {
        // Already a callback there, probably UnlessCallback
        this.callback[type_] = new CallChain(
          this.callback[type_],
          f,
          (t) => t.type === type_
        );
      } else {
        this.callback[type_] = f;
      }
    }

    this._scanner = new Scanner(
      terminals,
      this.g_regex_flags,
      this.re,
      this.use_bytes
    );
  }

  get scanner() {
    if (this._scanner === null) {
      this._build_scanner();
    }

    return this._scanner;
  }

  match(text, pos) {
    return this.scanner.match(text, pos);
  }

  *lex(state, parser_state) {
    try {
      while (true) {
        yield this.next_token(state, parser_state);
      }
    } catch (e) {
      if (e instanceof EOFError) {
        // pass
      } else {
        throw e;
      }
    }
  }

  next_token(lex_state, parser_state = null) {
    let allowed, res, t, t2, type_, value;
    let line_ctr = lex_state.line_ctr;
    while (line_ctr.char_pos < lex_state.text.length) {
      res = this.match(lex_state.text, line_ctr.char_pos);
      if (!res) {
        allowed = set_subtract(this.scanner.allowed_types, this.ignore_types);
        if (!allowed) {
          allowed = new Set(["<END-OF-FILE>"]);
        }

        throw new UnexpectedCharacters({
          seq: lex_state.text,
          lex_pos: line_ctr.char_pos,
          line: line_ctr.line,
          column: line_ctr.column,
          allowed: allowed,
          token_history: lex_state.last_token && [lex_state.last_token],
          state: parser_state,
          terminals_by_name: this.terminals_by_name,
        });
      }

      let [value, type_] = res;
      if (!this.ignore_types.has(type_)) {
        t = new Token(
          type_,
          value,
          line_ctr.char_pos,
          line_ctr.line,
          line_ctr.column
        );
        line_ctr.feed(value, this.newline_types.has(type_));
        t.end_line = line_ctr.line;
        t.end_column = line_ctr.column;
        t.end_pos = line_ctr.char_pos;
        if (t.type in this.callback) {
          t = this.callback[t.type](t);
          if (!(t instanceof Token)) {
            throw new LexError(
              format("Callbacks must return a token (returned %r)", t)
            );
          }
        }

        lex_state.last_token = t;
        return t;
      } else {
        if (type_ in this.callback) {
          t2 = new Token(
            type_,
            value,
            line_ctr.char_pos,
            line_ctr.line,
            line_ctr.column
          );
          this.callback[type_](t2);
        }

        line_ctr.feed(value, this.newline_types.has(type_));
      }
    }

    // EOF
    throw new EOFError(this);
  }
}

class ContextualLexer extends Lexer {
  constructor({ conf, states, always_accept = [] } = {}) {
    super();
    let accepts, key, lexer, lexer_conf;
    let terminals = [...conf.terminals];
    let terminals_by_name = conf.terminals_by_name;
    let trad_conf = copy(conf);
    trad_conf.terminals = terminals;
    let lexer_by_tokens = new Map();
    this.lexers = {};
    for (let [state, accepts] of dict_items(states)) {
      key = frozenset(accepts);
      if (lexer_by_tokens.has(key)) {
        lexer = lexer_by_tokens.get(key);
      } else {
        accepts = union(new Set(accepts), [
          ...new Set(conf.ignore),
          ...new Set(always_accept),
        ]);
        lexer_conf = copy(trad_conf);
        lexer_conf.terminals = [...accepts]
          .filter((n) => n in terminals_by_name)
          .map((n) => terminals_by_name[n]);
        lexer = new BasicLexer(lexer_conf);
        lexer_by_tokens.set(key, lexer);
      }
      this.lexers[state] = lexer;
    }

    this.root_lexer = new BasicLexer(trad_conf);
  }

  *lex(lexer_state, parser_state) {
    let last_token, lexer, token;
    try {
      while (true) {
        lexer = this.lexers[parser_state.position];
        yield lexer.next_token(lexer_state, parser_state);
      }
    } catch (e) {
      if (e instanceof EOFError) {
        // pass
      } else if (e instanceof UnexpectedCharacters) {
        // In the contextual lexer, UnexpectedCharacters can mean that the terminal is defined, but not in the current context.
        // This tests the input against the global context, to provide a nicer error.
        try {
          last_token = lexer_state.last_token;
          // Save last_token. Calling root_lexer.next_token will change this to the wrong token
          token = this.root_lexer.next_token(lexer_state, parser_state);
          throw new UnexpectedToken({
            token: token,
            expected: e.allowed,
            state: parser_state,
            token_history: [last_token],
            terminals_by_name: this.root_lexer.terminals_by_name,
          });
        } catch (e) {
          if (e instanceof UnexpectedCharacters) {
            throw e;
          } else {
            throw e;
          }
        }
      } else {
        throw e;
      }
    }
  }
}

//
// Common
//

class LexerConf extends Serialize {
  static get __serialize_fields__() {
    return ["terminals", "ignore", "g_regex_flags", "use_bytes", "lexer_type"];
  }
  static get __serialize_namespace__() {
    return [TerminalDef];
  }
  constructor({
    terminals,
    re_module,
    ignore = [],
    postlex = null,
    callbacks = null,
    g_regex_flags = '',
    skip_validation = false,
    use_bytes = false,
  } = {}) {
    super();
    this.terminals = terminals;
    this.terminals_by_name = Object.fromEntries(
      this.terminals.map((t) => [t.name, t])
    );
    this.ignore = ignore;
    this.postlex = postlex;
    this.callbacks = Object.keys(callbacks).length || {};
    this.g_regex_flags = g_regex_flags;
    this.re_module = re_module;
    this.skip_validation = skip_validation;
    this.use_bytes = use_bytes;
    this.lexer_type = null;
  }

  _deserialize() {
    this.terminals_by_name = Object.fromEntries(
      this.terminals.map((t) => [t.name, t])
    );
  }
}

class ParserConf extends Serialize {
  static get __serialize_fields__() {
    return ["rules", "start", "parser_type"];
  }
  constructor(rules, callbacks, start) {
    super();
    this.rules = rules;
    this.callbacks = callbacks;
    this.start = start;
    this.parser_type = null;
  }
}

//
// Parse Tree Builder
//

class _ExpandSingleChild {
  constructor(node_builder) {
    this.node_builder = node_builder;
  }

  __call__(children) {
    if (children.length === 1) {
      return children[0];
    } else {
      return this.node_builder(children);
    }
  }
}

const ExpandSingleChild = callable_class(_ExpandSingleChild);
class _PropagatePositions {
  constructor(node_builder, node_filter = null) {
    this.node_builder = node_builder;
    this.node_filter = node_filter;
  }

  __call__(children) {
    let first_meta, last_meta, res_meta;
    let res = this.node_builder(children);
    if (res instanceof Tree) {
      // Calculate positions while the tree is streaming, according to the rule:
      // - nodes start at the start of their first child's container,
      //   and end at the end of their last child's container.
      // Containers are nodes that take up space in text, but have been inlined in the tree.

      res_meta = res.meta;
      first_meta = this._pp_get_meta(children);
      if (first_meta !== null) {
        if (!("line" in res_meta)) {
          // meta was already set, probably because the rule has been inlined (e.g. `?rule`)
          res_meta.line =
            (first_meta && first_meta["container_line"]) || first_meta.line;
          res_meta.column =
            (first_meta && first_meta["container_column"]) || first_meta.column;
          res_meta.start_pos =
            (first_meta && first_meta["container_start_pos"]) ||
            first_meta.start_pos;
          res_meta.empty = false;
        }

        res_meta.container_line =
          (first_meta && first_meta["container_line"]) || first_meta.line;
        res_meta.container_column =
          (first_meta && first_meta["container_column"]) || first_meta.column;
      }

      last_meta = this._pp_get_meta([...children].reverse());
      if (last_meta !== null) {
        if (!("end_line" in res_meta)) {
          res_meta.end_line =
            (last_meta && last_meta["container_end_line"]) ||
            last_meta.end_line;
          res_meta.end_column =
            (last_meta && last_meta["container_end_column"]) ||
            last_meta.end_column;
          res_meta.end_pos =
            (last_meta && last_meta["container_end_pos"]) || last_meta.end_pos;
          res_meta.empty = false;
        }

        res_meta.container_end_line =
          (last_meta && last_meta["container_end_line"]) || last_meta.end_line;
        res_meta.container_end_column =
          (last_meta && last_meta["container_end_column"]) ||
          last_meta.end_column;
      }
    }

    return res;
  }

  _pp_get_meta(children) {
    for (const c of children) {
      if (this.node_filter !== null && !this.node_filter(c)) {
        continue;
      }

      if (c instanceof Tree) {
        if (!c.meta.empty) {
          return c.meta;
        }
      } else if (c instanceof Token) {
        return c;
      }
    }
  }
}

const PropagatePositions = callable_class(_PropagatePositions);
function make_propagate_positions(option) {
  if (callable(option)) {
    return partial({
      unknown_param_0: PropagatePositions,
      node_filter: option,
    });
  } else if (option === true) {
    return PropagatePositions;
  } else if (option === false) {
    return null;
  }

  throw new ConfigurationError(
    format("Invalid option for propagate_positions: %r", option)
  );
}

class _ChildFilter {
  constructor(to_include, append_none, node_builder) {
    this.node_builder = node_builder;
    this.to_include = to_include;
    this.append_none = append_none;
  }

  __call__(children) {
    let filtered = [];
    for (const [i, to_expand, add_none] of this.to_include) {
      if (add_none) {
        filtered.push(...list_repeat([null], add_none));
      }

      if (to_expand) {
        filtered.push(...children[i].children);
      } else {
        filtered.push(children[i]);
      }
    }

    if (this.append_none) {
      filtered.push(...list_repeat([null], this.append_none));
    }

    return this.node_builder(filtered);
  }
}

const ChildFilter = callable_class(_ChildFilter);
/**
  Optimized childfilter for LALR (assumes no duplication in parse tree, so it's safe to change it)
*/

class _ChildFilterLALR extends _ChildFilter {
  __call__(children) {
    let filtered = [];
    for (const [i, to_expand, add_none] of this.to_include) {
      if (add_none) {
        filtered.push(...list_repeat([null], add_none));
      }

      if (to_expand) {
        if (filtered.length) {
          filtered.push(...children[i].children);
        } else {
          // Optimize for left-recursion
          filtered = children[i].children;
        }
      } else {
        filtered.push(children[i]);
      }
    }

    if (this.append_none) {
      filtered.push(...list_repeat([null], this.append_none));
    }

    return this.node_builder(filtered);
  }
}

const ChildFilterLALR = callable_class(_ChildFilterLALR);
/**
  Optimized childfilter for LALR (assumes no duplication in parse tree, so it's safe to change it)
*/

class _ChildFilterLALR_NoPlaceholders extends _ChildFilter {
  constructor(to_include, node_builder) {
    super();
    this.node_builder = node_builder;
    this.to_include = to_include;
  }

  __call__(children) {
    let filtered = [];
    for (const [i, to_expand] of this.to_include) {
      if (to_expand) {
        if (filtered.length) {
          filtered.push(...children[i].children);
        } else {
          // Optimize for left-recursion
          filtered = children[i].children;
        }
      } else {
        filtered.push(children[i]);
      }
    }

    return this.node_builder(filtered);
  }
}

const ChildFilterLALR_NoPlaceholders = callable_class(
  _ChildFilterLALR_NoPlaceholders
);
function _should_expand(sym) {
  return !sym.is_term && sym.name.startsWith("_");
}

function maybe_create_child_filter(
  expansion,
  keep_all_tokens,
  ambiguous,
  _empty_indices
) {
  let empty_indices, s;
  // Prepare empty_indices as: How many Nones to insert at each index?
  if (_empty_indices.length) {
    s = _empty_indices.map((b) => (0 + b).toString()).join("");
    empty_indices = s.split("0").map((ones) => ones.length);
  } else {
    empty_indices = list_repeat([0], expansion.length + 1);
  }
  let to_include = [];
  let nones_to_add = 0;
  for (const [i, sym] of enumerate(expansion)) {
    nones_to_add += empty_indices[i];
    if (keep_all_tokens || !(sym.is_term && sym.filter_out)) {
      to_include.push([i, _should_expand(sym), nones_to_add]);
      nones_to_add = 0;
    }
  }

  nones_to_add += empty_indices[expansion.length];
  if (
    _empty_indices.length ||
    to_include.length < expansion.length ||
    any(to_include.map(([i, to_expand, _]) => to_expand))
  ) {
    if ((_empty_indices.length || ambiguous).length) {
      return partial(
        ambiguous ? ChildFilter : ChildFilterLALR,
        to_include,
        nones_to_add
      );
    } else {
      // LALR without placeholders
      return partial(
        ChildFilterLALR_NoPlaceholders,
        to_include.map(([i, x, _]) => [i, x])
      );
    }
  }
}


/**

    Propagate ambiguous intermediate nodes and their derivations up to the
    current rule.

    In general, converts

    rule
      _iambig
        _inter
          someChildren1
          ...
        _inter
          someChildren2
          ...
      someChildren3
      ...

    to

    _ambig
      rule
        someChildren1
        ...
        someChildren3
        ...
      rule
        someChildren2
        ...
        someChildren3
        ...
      rule
        childrenFromNestedIambigs
        ...
        someChildren3
        ...
      ...

    propagating up any nested '_iambig' nodes along the way.

*/

function inplace_transformer(func) {
  function f(children) {
    // function name in a Transformer is a rule name.
    let tree = new Tree(func.name, children);
    return func(tree);
  }

  f = wraps(func)(f);
  return f;
}

function apply_visit_wrapper(func, name, wrapper) {
  if (wrapper === _vargs_meta || wrapper === _vargs_meta_inline) {
    throw new NotImplementedError(
      "Meta args not supported for internal transformer"
    );
  }

  function f(children) {
    return wrapper(func, name, children, null);
  }

  f = wraps(func)(f);
  return f;
}

class ParseTreeBuilder {
  constructor(
    rules,
    tree_class,
    propagate_positions = false,
    ambiguous = false,
    maybe_placeholders = false
  ) {
    this.tree_class = tree_class;
    this.propagate_positions = propagate_positions;
    this.ambiguous = ambiguous;
    this.maybe_placeholders = maybe_placeholders;
    this.rule_builders = [...this._init_builders(rules)];
  }

  *_init_builders(rules) {
    let expand_single_child, keep_all_tokens, options, wrapper_chain;
    let propagate_positions = make_propagate_positions(
      this.propagate_positions
    );
    for (const rule of rules) {
      options = rule.options;
      keep_all_tokens = options.keep_all_tokens;
      expand_single_child = options.expand1;
      wrapper_chain = [
        ...filter(null, [
          expand_single_child && !rule.alias && ExpandSingleChild,
          maybe_create_child_filter(
            rule.expansion,
            keep_all_tokens,
            this.ambiguous,
            this.maybe_placeholders ? options.empty_indices : []
          ),
          propagate_positions,
        ]),
      ];
      yield [rule, wrapper_chain];
    }
  }

  create_callback(transformer = null) {
    let f, user_callback_name, wrapper;
    let callbacks = new Map();
    for (const [rule, wrapper_chain] of this.rule_builders) {
      user_callback_name =
        rule.alias || rule.options.template_source || rule.origin.name;
      if (transformer && transformer[user_callback_name]) {
        f = transformer && transformer[user_callback_name];
        wrapper = (f && f["visit_wrapper"]) || null;
        if (wrapper !== null) {
          f = apply_visit_wrapper(f, user_callback_name, wrapper);
        } else if (transformer instanceof Transformer_InPlace) {
          f = inplace_transformer(f);
        }
      } else {
        f = partial(this.tree_class, user_callback_name);
      }
      for (const w of wrapper_chain) {
        f = w(f);
      }

      if (callbacks.has(rule)) {
        throw new GrammarError(format("Rule '%s' already exists", rule));
      }

      callbacks.set(rule, f);
    }

    return callbacks;
  }
}

//
// Lalr Parser
//

class LALR_Parser extends Serialize {
  constructor({ parser_conf, debug = false } = {}) {
    super();
    let analysis = new LALR_Analyzer({
      unknown_param_0: parser_conf,
      debug: debug,
    });
    analysis.compute_lalr();
    let callbacks = parser_conf.callbacks;
    this._parse_table = analysis.parse_table;
    this.parser_conf = parser_conf;
    this.parser = new _Parser(analysis.parse_table, callbacks, debug);
  }

  static deserialize(data, memo, callbacks, debug = false) {
    const cls = this;
    let inst = new_object(cls);
    inst._parse_table = IntParseTable.deserialize(data, memo);
    inst.parser = new _Parser(inst._parse_table, callbacks, debug);
    return inst;
  }

  serialize(memo) {
    return this._parse_table.serialize(memo);
  }

  parse_interactive(lexer, start) {
    return this.parser.parse({
      lexer: lexer,
      start: start,
      start_interactive: true,
    });
  }

  parse({lexer, start, on_error = null} = {}) {
    let e, p, s;
    try {
      return this.parser.parse({ lexer: lexer, start: start });
    } catch (e) {
      if (e instanceof UnexpectedInput) {
        if (on_error === null) {
          throw e;
        }

        while (true) {
          if (e instanceof UnexpectedCharacters) {
            s = e.interactive_parser.lexer_thread.state;
            p = s.line_ctr.char_pos;
          }

          if (!on_error(e)) {
            throw e;
          }

          if (e instanceof UnexpectedCharacters) {
            // If user didn't change the character position, then we should
            if (p === s.line_ctr.char_pos) {
              s.line_ctr.feed(s.text.slice(p, p + 1));
            }
          }

          try {
            return e.interactive_parser.resume_parse();
          } catch (e2) {
            if (e2 instanceof UnexpectedToken) {
              if (
                e instanceof UnexpectedToken &&
                e.token.type === e2.token.type &&
                e2.token.type === "$END" &&
                e.interactive_parser.eq(e2.interactive_parser)
              ) {
                // Prevent infinite loop
                throw e2;
              }

              e = e2;
            } else if (e2 instanceof UnexpectedCharacters) {
              e = e2;
            } else {
              throw e2;
            }
          }
        }
      } else {
        throw e;
      }
    }
  }
}

class ParseConf {
  constructor(parse_table, callbacks, start) {
    this.parse_table = parse_table;
    this.start_state = this.parse_table.start_states[start];
    this.end_state = this.parse_table.end_states[start];
    this.states = this.parse_table.states;
    this.callbacks = callbacks;
    this.start = start;
  }
}

class ParserState {
  constructor(parse_conf, lexer, state_stack = null, value_stack = null) {
    this.parse_conf = parse_conf;
    this.lexer = lexer;
    this.state_stack = state_stack || [this.parse_conf.start_state];
    this.value_stack = value_stack || [];
  }

  get position() {
    return last_item(this.state_stack);
  }

  // Necessary for match_examples() to work

  eq(other) {
    if (!(other instanceof ParserState)) {
      return NotImplemented;
    }

    return (
      this.state_stack.length === other.state_stack.length &&
      this.position === other.position
    );
  }

  copy() {
    return copy(this);
  }

  feed_token(token, is_end = false) {
    let _action, action, arg, expected, new_state, rule, s, size, state, value;
    let state_stack = this.state_stack;
    let value_stack = this.value_stack;
    let states = this.parse_conf.states;
    let end_state = this.parse_conf.end_state;
    let callbacks = this.parse_conf.callbacks;
    while (true) {
      state = last_item(state_stack);
      if ( token.type in states[state] ) {
        [action, arg] = states[state][token.type];
      } else {
        expected = new Set(
          dict_keys(states[state])
            .filter((s) => isupper(s))
            .map((s) => s)
        );
        throw new UnexpectedToken({
          token: token,
          expected: expected,
          state: this,
          interactive_parser: null,
        });
      }
      if (action === Shift) {
        // shift once and return

        state_stack.push(arg);
        value_stack.push(
          !(token.type in callbacks) ? token : callbacks[token.type](token)
        );
        return;
      } else {
        // reduce+shift as many times as necessary
        rule = arg;
        size = rule.expansion.length;
        if (size) {
          s = value_stack.slice(-size);
          state_stack.splice(-size);
          value_stack.splice(-size);
        } else {
          s = [];
        }
        value = callbacks.get(rule)(s);
        [_action, new_state] = states[last_item(state_stack)][rule.origin.name];
        state_stack.push(new_state);
        value_stack.push(value);
        if (is_end && last_item(state_stack) === end_state) {
          return last_item(value_stack);
        }
      }
    }
  }
}

class _Parser {
  constructor(parse_table, callbacks, debug = false) {
    this.parse_table = parse_table;
    this.callbacks = callbacks;
    this.debug = debug;
  }

  parse({
    lexer,
    start,
    value_stack = null,
    state_stack = null,
    start_interactive = false,
  } = {}) {
    let parse_conf = new ParseConf(this.parse_table, this.callbacks, start);
    let parser_state = new ParserState(
      parse_conf,
      lexer,
      state_stack,
      value_stack
    );
    if (start_interactive) {
      return new InteractiveParser(this, parser_state, parser_state.lexer);
    }

    return this.parse_from_state(parser_state);
  }

  parse_from_state(state) {
    let end_token, token;
    // Main LALR-parser loop
    try {
      token = null;
      for (token of state.lexer.lex(state)) {
        state.feed_token(token);
      }

      end_token = token
        ? Token.new_borrow_pos("$END", "", token)
        : new Token("$END", "", 0, 1, 1);
      return state.feed_token(end_token, true);
    } catch (e) {
      if (e instanceof UnexpectedInput) {
        try {
          e.interactive_parser = new InteractiveParser(
            this,
            state,
            state.lexer
          );
        } catch (e) {
          if (e instanceof ReferenceError) {
            // pass
          } else {
            throw e;
          }
        }
        throw e;
      } else if (e instanceof Error) {
        if (this.debug) {
          console.log("");
          console.log("STATE STACK DUMP");
          console.log("----------------");
          for (const [i, s] of enumerate(state.state_stack)) {
            console.log(format("%d)", i), s);
          }

          console.log("");
        }

        throw e;
      } else {
        throw e;
      }
    }
  }
}

//
// Lalr Interactive Parser
//

// This module provides a LALR interactive parser, which is used for debugging and error handling

/**
  InteractiveParser gives you advanced control over parsing and error handling when parsing with LALR.

    For a simpler interface, see the ``on_error`` argument to ``Lark.parse()``.

*/

class InteractiveParser {
  constructor(parser, parser_state, lexer_thread) {
    this.parser = parser;
    this.parser_state = parser_state;
    this.lexer_thread = lexer_thread;
    this.result = null;
  }

  /**
    Feed the parser with a token, and advance it to the next state, as if it received it from the lexer.

        Note that ``token`` has to be an instance of ``Token``.

  */
  feed_token(token) {
    return this.parser_state.feed_token(token, token.type === "$END");
  }

  /**
    Step through the different stages of the parse, by reading tokens from the lexer
        and feeding them to the parser, one per iteration.

        Returns an iterator of the tokens it encounters.

        When the parse is over, the resulting tree can be found in ``InteractiveParser.result``.

  */
  *iter_parse() {
    for (const token of this.lexer_thread.lex(this.parser_state)) {
      yield token;
      this.result = this.feed_token(token);
    }
  }

  /**
    Try to feed the rest of the lexer state into the interactive parser.

        Note that this modifies the instance in place and does not feed an '$END' Token

  */
  exhaust_lexer() {
    return [...this.iter_parse()];
  }

  /**
    Feed a '$END' Token. Borrows from 'last_token' if given.
  */
  feed_eof(last_token = null) {
    let eof =
      last_token !== null
        ? Token.new_borrow_pos("$END", "", last_token)
        : new Token("$END", "", 0, 1, 1);
    return this.feed_token(eof);
  }

  copy() {
    return copy(this);
  }

  eq(other) {
    if (!(other instanceof InteractiveParser)) {
      return false;
    }

    return (
      this.parser_state === other.parser_state &&
      this.lexer_thread === other.lexer_thread
    );
  }

  /**
    Convert to an ``ImmutableInteractiveParser``.
  */
  as_immutable() {
    let p = copy(this);
    return new ImmutableInteractiveParser(
      p.parser,
      p.parser_state,
      p.lexer_thread
    );
  }

  /**
    Print the output of ``choices()`` in a way that's easier to read.
  */
  pretty() {
    let out = ["Parser choices:"];
    for (const [k, v] of dict_items(this.choices())) {
      out.push(format("\t- %s -> %r", k, v));
    }

    out.push(format("stack size: %s", this.parser_state.state_stack.length));
    return out.join("\n");
  }

  /**
    Returns a dictionary of token types, matched to their action in the parser.

        Only returns token types that are accepted by the current state.

        Updated by ``feed_token()``.

  */
  choices() {
    return this.parser_state.parse_conf.parse_table.states[
      this.parser_state.position
    ];
  }

  /**
    Returns the set of possible tokens that will advance the parser into a new valid state.
  */
  accepts() {
    let new_cursor;
    let accepts = new Set();
    for (const t of this.choices()) {
      if (isupper(t)) {
        // is terminal?
        new_cursor = copy(this);
        let exc = null;
        try {
          new_cursor.feed_token(new Token(t, ""));
        } catch (e) {
          exc = e;
          if (e instanceof UnexpectedToken) {
            // pass
          } else {
            throw e;
          }
        }
        if (!exc) {
          accepts.add(t);
        }
      }
    }

    return accepts;
  }

  /**
    Resume automated parsing from the current state.
  */
  resume_parse() {
    return this.parser.parse_from_state(this.parser_state);
  }
}

/**
  Same as ``InteractiveParser``, but operations create a new instance instead
    of changing it in-place.

*/

class ImmutableInteractiveParser extends InteractiveParser {
  result = null;
  feed_token(token) {
    let c = copy(this);
    c.result = InteractiveParser.feed_token(c, token);
    return c;
  }

  /**
    Try to feed the rest of the lexer state into the parser.

        Note that this returns a new ImmutableInteractiveParser and does not feed an '$END' Token
  */
  exhaust_lexer() {
    let cursor = this.as_mutable();
    cursor.exhaust_lexer();
    return cursor.as_immutable();
  }

  /**
    Convert to an ``InteractiveParser``.
  */
  as_mutable() {
    let p = copy(this);
    return new InteractiveParser(p.parser, p.parser_state, p.lexer_thread);
  }
}

//
// Lalr Analysis
//

class Action {
  constructor(name) {
    this.name = name;
  }

  repr() {
    return this.toString();
  }
}

var Shift = new Action("Shift");
var Reduce = new Action("Reduce");
class ParseTable {
  constructor(states, start_states, end_states) {
    this.states = states;
    this.start_states = start_states;
    this.end_states = end_states;
  }

  serialize(memo) {
    let tokens = new Enumerator();
    let states = Object.fromEntries(
      dict_items(this.states).map(([state, actions]) => [
        state,
        Object.fromEntries(
          dict_items(actions).map(([token, [action, arg]]) => [
            dict_get(tokens, token),
            action === Reduce ? [1, arg.serialize(memo)] : [0, arg],
          ])
        ),
      ])
    );
    return {
      tokens: tokens.reversed(),
      states: states,
      start_states: this.start_states,
      end_states: this.end_states,
    };
  }

  static deserialize(data, memo) {
    const cls = this;
    let tokens = data["tokens"];
    let states = Object.fromEntries(
      dict_items(data["states"]).map(([state, actions]) => [
        state,
        Object.fromEntries(
          dict_items(actions).map(([token, [action, arg]]) => [
            tokens[token],
            action === 1 ? [Reduce, Rule.deserialize(arg, memo)] : [Shift, arg],
          ])
        ),
      ])
    );
    return new cls(states, data["start_states"], data["end_states"]);
  }
}

class IntParseTable extends ParseTable {
  static from_ParseTable(parse_table) {
    const cls = this;
    let enum_ = [...parse_table.states];
    let state_to_idx = Object.fromEntries(
      enumerate(enum_).map(([i, s]) => [s, i])
    );
    let int_states = {};
    for (let [s, la] of dict_items(parse_table.states)) {
      la = Object.fromEntries(
        dict_items(la).map(([k, v]) => [
          k,
          v[0] === Shift ? [v[0], state_to_idx[v[1]]] : v,
        ])
      );
      int_states[state_to_idx[s]] = la;
    }

    let start_states = Object.fromEntries(
      dict_items(parse_table.start_states).map(([start, s]) => [
        start,
        state_to_idx[s],
      ])
    );
    let end_states = Object.fromEntries(
      dict_items(parse_table.end_states).map(([start, s]) => [
        start,
        state_to_idx[s],
      ])
    );
    return new cls(int_states, start_states, end_states);
  }
}

//
// Parser Frontends
//

function _wrap_lexer(lexer_class) {
  let future_interface =
    (lexer_class && lexer_class["__future_interface__"]) || false;
  if (future_interface) {
    return lexer_class;
  } else {
    class CustomLexerWrapper extends Lexer {
      constructor(lexer_conf) {
        super();
        this.lexer = lexer_class(lexer_conf);
      }

      lex(lexer_state, parser_state) {
        return this.lexer.lex(lexer_state.text);
      }
    }

    return CustomLexerWrapper;
  }
}

class MakeParsingFrontend {
  constructor(parser_type, lexer_type) {
    this.parser_type = parser_type;
    this.lexer_type = lexer_type;
  }

  deserialize(data, memo, lexer_conf, callbacks, options) {
    let parser_conf = ParserConf.deserialize(data["parser_conf"], memo);
    let parser = LALR_Parser.deserialize(
      data["parser"],
      memo,
      callbacks,
      options.debug
    );
    parser_conf.callbacks = callbacks;
    return new ParsingFrontend({
      lexer_conf: lexer_conf,
      parser_conf: parser_conf,
      options: options,
      parser: parser,
    });
  }
}

// ... Continued later in the module

function _deserialize_parsing_frontend(
  data,
  memo,
  lexer_conf,
  callbacks,
  options
) {
  let parser_conf = ParserConf.deserialize(data["parser_conf"], memo);
  let parser = LALR_Parser.deserialize(data["parser"], memo, callbacks, options.debug);
  parser_conf.callbacks = callbacks;
  return new ParsingFrontend({
    lexer_conf: lexer_conf,
    parser_conf: parser_conf,
    options: options,
    parser: parser,
  });
}

var _parser_creators = {}

class ParsingFrontend extends Serialize {
  static get __serialize_fields__() {
    return ["lexer_conf", "parser_conf", "parser"];
  }
  constructor({ lexer_conf, parser_conf, options, parser = null } = {}) {
    super();
    let create_lexer, create_parser;
    this.parser_conf = parser_conf;
    this.lexer_conf = lexer_conf;
    this.options = options;
    // Set-up parser
    if (parser) {
      // From cache
      this.parser = parser;
    } else {
      create_parser = dict_get(_parser_creators, parser_conf.parser_type);
      this.parser = create_parser(lexer_conf, parser_conf, options);
    }
    // Set-up lexer
    let lexer_type = lexer_conf.lexer_type;
    this.skip_lexer = false;
    if (["dynamic", "dynamic_complete"].includes(lexer_type)) {
      this.skip_lexer = true;
      return;
    }

    const lexers = {
        basic: create_basic_lexer,
        contextual: create_contextual_lexer
    }
    if (lexer_type in lexers) {
      create_lexer = lexers[lexer_type];
      this.lexer = create_lexer(
        lexer_conf,
        this.parser,
        lexer_conf.postlex,
        options
      );
    } else {
      this.lexer = _wrap_lexer(lexer_type)(lexer_conf);
    }
    if (lexer_conf.postlex) {
      this.lexer = new PostLexConnector(this.lexer, lexer_conf.postlex);
    }
  }

  _verify_start(start = null) {
    let start_decls;
    if (start === null) {
      start_decls = this.parser_conf.start;
      if (start_decls.length > 1) {
        throw new ConfigurationError(
          "Lark initialized with more than 1 possible start rule. Must specify which start rule to parse",
          start_decls
        );
      }

      [start] = start_decls;
    } else if (!(this.parser_conf.start.includes(start))) {
      throw new ConfigurationError(
        format(
          "Unknown start rule %s. Must be one of %r",
          start,
          this.parser_conf.start
        )
      );
    }

    return start;
  }

  _make_lexer_thread(text) {
    return this.skip_lexer ? text : LexerThread.from_text(this.lexer, text);
  }

  parse(text, start = null, on_error = null) {
    let chosen_start = this._verify_start(start);
    let kw = on_error === null ? {} : { on_error: on_error };
    let stream = this._make_lexer_thread(text);
    return this.parser.parse({
      lexer: stream,
      start: chosen_start,
      ...kw,
    });
  }

  parse_interactive(text = null, start = null) {
    let chosen_start = this._verify_start(start);
    if (this.parser_conf.parser_type !== "lalr") {
      throw new ConfigurationError(
        "parse_interactive() currently only works with parser='lalr' "
      );
    }

    let stream = this._make_lexer_thread(text);
    return this.parser.parse_interactive(stream, chosen_start);
  }
}

function _validate_frontend_args(parser, lexer) {
  let expected;
  assert_config(parser, ["lalr", "earley", "cyk"]);
  if (!(typeof lexer === "object")) {
    // not custom lexer?
    expected = {
      lalr: ["basic", "contextual"],
      earley: ["basic", "dynamic", "dynamic_complete"],
      cyk: ["basic"],
    }[parser];
    assert_config(
      lexer,
      expected,
      format(
        "Parser %r does not support lexer %%r, expected one of %%s",
        parser
      )
    );
  }
}

function _get_lexer_callbacks(transformer, terminals) {
  let callback;
  let result = {};
  for (const terminal of terminals) {
    callback = (transformer && transformer[terminal.name]) || null;
    if (callback !== null) {
      result[terminal.name] = callback;
    }
  }

  return result;
}

class PostLexConnector {
  constructor(lexer, postlexer) {
    this.lexer = lexer;
    this.postlexer = postlexer;
  }

  lex(lexer_state, parser_state) {
    let i = this.lexer.lex(lexer_state, parser_state);
    return this.postlexer.process(i);
  }
}

function create_basic_lexer(lexer_conf, parser, postlex, options) {
  return new BasicLexer(lexer_conf);
}

function create_contextual_lexer(lexer_conf, parser, postlex, options) {
  let states = Object.fromEntries(
    dict_items(parser._parse_table.states).map(([idx, t]) => [
      idx,
      [...dict_keys(t)],
    ])
  );
  let always_accept = postlex ? postlex.always_accept : [];
  return new ContextualLexer({
    conf: lexer_conf,
    states: states,
    always_accept: always_accept,
  });
}

function create_lalr_parser(lexer_conf, parser_conf, options = null) {
  let debug = options ? options.debug : false;
  return new LALR_Parser({ parser_conf: parser_conf, debug: debug });
}

_parser_creators["lalr"] = create_lalr_parser;

//
// Lark
//

class PostLex extends ABC {
  process(stream) {
    return stream;
  }

  always_accept = [];
}

/**
  Specifies the options for Lark


*/

class LarkOptions extends Serialize {
  OPTIONS_DOC = `
    **===  General Options  ===**

    start
            The start symbol. Either a string, or a list of strings for multiple possible starts (Default: "start")
    debug
            Display debug information and extra warnings. Use only when debugging (Default: \`\`False\`\`)
            When used with Earley, it generates a forest graph as "sppf.png", if 'dot' is installed.
    transformer
            Applies the transformer to every parse tree (equivalent to applying it after the parse, but faster)
    propagate_positions
            Propagates (line, column, end_line, end_column) attributes into all tree branches.
            Accepts \`\`False\`\`, \`\`True\`\`, or a callable, which will filter which nodes to ignore when propagating.
    maybe_placeholders
            When \`\`True\`\`, the \`\`[]\`\` operator returns \`\`None\`\` when not matched.
            When \`\`False\`\`,  \`\`[]\`\` behaves like the \`\`?\`\` operator, and returns no value at all.
            (default= \`\`True\`\`)
    cache
            Cache the results of the Lark grammar analysis, for x2 to x3 faster loading. LALR only for now.

            - When \`\`False\`\`, does nothing (default)
            - When \`\`True\`\`, caches to a temporary file in the local directory
            - When given a string, caches to the path pointed by the string
    regex
            When True, uses the \`\`regex\`\` module instead of the stdlib \`\`re\`\`.
    g_regex_flags
            Flags that are applied to all terminals (both regex and strings)
    keep_all_tokens
            Prevent the tree builder from automagically removing "punctuation" tokens (Default: \`\`False\`\`)
    tree_class
            Lark will produce trees comprised of instances of this class instead of the default \`\`lark.Tree\`\`.

    **=== Algorithm Options ===**

    parser
            Decides which parser engine to use. Accepts "earley" or "lalr". (Default: "earley").
            (there is also a "cyk" option for legacy)
    lexer
            Decides whether or not to use a lexer stage

            - "auto" (default): Choose for me based on the parser
            - "basic": Use a basic lexer
            - "contextual": Stronger lexer (only works with parser="lalr")
            - "dynamic": Flexible and powerful (only with parser="earley")
            - "dynamic_complete": Same as dynamic, but tries *every* variation of tokenizing possible.
    ambiguity
            Decides how to handle ambiguity in the parse. Only relevant if parser="earley"

            - "resolve": The parser will automatically choose the simplest derivation
              (it chooses consistently: greedy for tokens, non-greedy for rules)
            - "explicit": The parser will return all derivations wrapped in "_ambig" tree nodes (i.e. a forest).
            - "forest": The parser will return the root of the shared packed parse forest.

    **=== Misc. / Domain Specific Options ===**

    postlex
            Lexer post-processing (Default: \`\`None\`\`) Only works with the basic and contextual lexers.
    priority
            How priorities should be evaluated - "auto", \`\`None\`\`, "normal", "invert" (Default: "auto")
    lexer_callbacks
            Dictionary of callbacks for the lexer. May alter tokens during lexing. Use with caution.
    use_bytes
            Accept an input of type \`\`bytes\`\` instead of \`\`str\`\`.
    edit_terminals
            A callback for editing the terminals before parse.
    import_paths
            A List of either paths or loader functions to specify from where grammars are imported
    source_path
            Override the source of from where the grammar was loaded. Useful for relative imports and unconventional grammar loading
    **=== End of Options ===**
    `;
  // Adding a new option needs to be done in multiple places:
  // - In the dictionary below. This is the primary truth of which options `Lark.__init__` accepts
  // - In the docstring above. It is used both for the docstring of `LarkOptions` and `Lark`, and in readthedocs
  // - As an attribute of `LarkOptions` above
  // - Potentially in `_LOAD_ALLOWED_OPTIONS` below this class, when the option doesn't change how the grammar is loaded
  // - Potentially in `lark.tools.__init__`, if it makes sense, and it can easily be passed as a cmd argument
  _defaults = {
    debug: false,
    keep_all_tokens: false,
    tree_class: null,
    cache: false,
    postlex: null,
    parser: "earley",
    lexer: "auto",
    transformer: null,
    start: "start",
    priority: "auto",
    ambiguity: "auto",
    regex: false,
    propagate_positions: false,
    lexer_callbacks: {},
    maybe_placeholders: true,
    edit_terminals: null,
    g_regex_flags: '',
    use_bytes: false,
    import_paths: [],
    source_path: null,
    _plugins: null,
  };
  constructor(options_dict) {
    super();
    let value;
    let o = dict(options_dict);
    let options = this;
    for (const [name, default_] of dict_items(this._defaults)) {
      if (name in o) {
        value = dict_pop(o, name);
        if (
          typeof default_ === "boolean" &&
          !["cache", "use_bytes", "propagate_positions"].includes(name)
        ) {
          value = bool(value);
        }
      } else {
        value = default_;
      }
      options[name] = value;
    }

    if (typeof options["start"] === "string") {
      options["start"] = [options["start"]];
    }

    this["options"] = options;
    assert_config(this.parser, ["earley", "lalr", "cyk", null]);
    if (this.parser === "earley" && this.transformer) {
      throw new ConfigurationError(
        "Cannot specify an embedded transformer when using the Earley algorithm. " +
          "Please use your transformer on the resulting parse tree, or use a different algorithm (i.e. LALR)"
      );
    }

    // if (Object.keys(o).length) {
    //   throw new ConfigurationError(format("Unknown options: %s", dict_keys(o)));
    // }
  }

  serialize(memo) {
    return this.options;
  }

  static deserialize(data, memo) {
    const cls = this;
    return new cls(data);
  }
}

// Options that can be passed to the Lark parser, even when it was loaded from cache/standalone.
// These options are only used outside of `load_grammar`.
var _LOAD_ALLOWED_OPTIONS = new Set([
  "postlex",
  "transformer",
  "lexer_callbacks",
  "use_bytes",
  "debug",
  "g_regex_flags",
  "regex",
  "propagate_positions",
  "tree_class",
]);
var _VALID_PRIORITY_OPTIONS = ["auto", "normal", "invert", null];
var _VALID_AMBIGUITY_OPTIONS = ["auto", "resolve", "explicit", "forest"];
/**
  Main interface for the library.

    It's mostly a thin wrapper for the many different parsers, and for the tree constructor.

    Parameters:
        grammar: a string or file-object containing the grammar spec (using Lark's ebnf syntax)
        options: a dictionary controlling various aspects of Lark.

    Example:
        >>> Lark(r'''start: "foo" ''')
        Lark(...)

*/

class Lark extends Serialize {
  static get __serialize_fields__() {
    return ["parser", "rules", "options"];
  }
  _build_lexer(dont_ignore = false) {
    let lexer_conf = this.lexer_conf;
    if (dont_ignore) {
      lexer_conf = copy(lexer_conf);
      lexer_conf.ignore = [];
    }

    return new BasicLexer(lexer_conf);
  }

  _prepare_callbacks() {
    this._callbacks = new Map();
    // we don't need these callbacks if we aren't building a tree
    if (this.options.ambiguity !== "forest") {
      this._parse_tree_builder = new ParseTreeBuilder(
        this.rules,
        this.options.tree_class || make_constructor(Tree),
        this.options.propagate_positions,
        this.options.parser !== "lalr" && this.options.ambiguity === "explicit",
        this.options.maybe_placeholders
      );
      this._callbacks = this._parse_tree_builder.create_callback(
        this.options.transformer
      );
    }

    dict_update(
      this._callbacks,
      _get_lexer_callbacks(this.options.transformer, this.terminals)
    );
  }

  /**
    Saves the instance into the given file object

        Useful for caching and multiprocessing.

  */
  /**
    Loads an instance from the given file object

        Useful for caching and multiprocessing.

  */
  _deserialize_lexer_conf(data, memo, options) {
    let lexer_conf = LexerConf.deserialize(data["lexer_conf"], memo);
    lexer_conf.callbacks = options.lexer_callbacks || {};
    lexer_conf.re_module = options.regex ? regex : re;
    lexer_conf.use_bytes = options.use_bytes;
    lexer_conf.g_regex_flags = options.g_regex_flags || '';
    lexer_conf.skip_validation = true;
    lexer_conf.postlex = options.postlex;
    return lexer_conf;
  }

  _load({ f, ...kwargs } = {}) {
    let d;
    if (is_dict(f)) {
      d = f;
    } else {
      d = pickle.load(f);
    }
    let memo_json = d["memo"];
    let data = d["data"];
    let memo = SerializeMemoizer.deserialize(
      memo_json,
      { Rule: Rule, TerminalDef: TerminalDef },
      {}
    );
    let options = dict(data["options"]);
    // if (
    //   (new Set(kwargs) - _LOAD_ALLOWED_OPTIONS) &
    //   new Set(LarkOptions._defaults)
    // ) {
    //   throw new ConfigurationError(
    //     "Some options are not allowed when loading a Parser: {}".format(
    //       new Set(kwargs) - _LOAD_ALLOWED_OPTIONS
    //     )
    //   );
    // }

    dict_update(options, kwargs);
    this.options = LarkOptions.deserialize(options, memo);
    this.rules = data["rules"].map((r) => Rule.deserialize(r, memo));
    this.source_path = "<deserialized>";
    _validate_frontend_args(this.options.parser, this.options.lexer);
    this.lexer_conf = this._deserialize_lexer_conf(
      data["parser"],
      memo,
      this.options
    );
    this.terminals = this.lexer_conf.terminals;
    this._prepare_callbacks();
    this._terminals_dict = Object.fromEntries(
      this.terminals.map((t) => [t.name, t])
    );
    this.parser = _deserialize_parsing_frontend(
      data["parser"],
      memo,
      this.lexer_conf,
      this._callbacks,
      this.options
    );
    return this;
  }

  static _load_from_dict({ data, memo, ...kwargs } = {}) {
    const cls = this;
    let inst = new_object(cls);
    return inst._load({
      f: { data: data, memo: memo },
      ...kwargs,
    });
  }

  /**
    Create an instance of Lark with the grammar given by its filename

        If ``rel_to`` is provided, the function will find the grammar filename in relation to it.

        Example:

            >>> Lark.open("grammar_file.lark", rel_to=__file__, parser="lalr")
            Lark(...)


  */
  /**
    Create an instance of Lark with the grammar loaded from within the package `package`.
        This allows grammar loading from zipapps.

        Imports in the grammar will use the `package` and `search_paths` provided, through `FromPackageLoader`

        Example:

            Lark.open_from_package(__name__, "example.lark", ("grammars",), parser=...)

  */
  repr() {
    return format(
      "Lark(open(%r), parser=%r, lexer=%r, ...)",
      this.source_path,
      this.options.parser,
      this.options.lexer
    );
  }

  /**
    Only lex (and postlex) the text, without parsing it. Only relevant when lexer='basic'

        When dont_ignore=True, the lexer will return all tokens, even those marked for %ignore.

        :raises UnexpectedCharacters: In case the lexer cannot find a suitable match.

  */
  lex(text, dont_ignore = false) {
    let lexer;
    if (!("lexer" in this) || dont_ignore) {
      lexer = this._build_lexer(dont_ignore);
    } else {
      lexer = this.lexer;
    }
    let lexer_thread = LexerThread.from_text(lexer, text);
    let stream = lexer_thread.lex(null);
    if (this.options.postlex) {
      return this.options.postlex.process(stream);
    }

    return stream;
  }

  /**
    Get information about a terminal
  */
  get_terminal(name) {
    return this._terminals_dict[name];
  }

  /**
    Start an interactive parsing session.

        Parameters:
            text (str, optional): Text to be parsed. Required for ``resume_parse()``.
            start (str, optional): Start symbol

        Returns:
            A new InteractiveParser instance.

        See Also: ``Lark.parse()``

  */
  parse_interactive(text = null, start = null) {
    return this.parser.parse_interactive({
      unknown_param_0: text,
      start: start,
    });
  }

  /**
    Parse the given text, according to the options provided.

        Parameters:
            text (str): Text to be parsed.
            start (str, optional): Required if Lark was given multiple possible start symbols (using the start option).
            on_error (function, optional): if provided, will be called on UnexpectedToken error. Return true to resume parsing.
                LALR only. See examples/advanced/error_handling.py for an example of how to use on_error.

        Returns:
            If a transformer is supplied to ``__init__``, returns whatever is the
            result of the transformation. Otherwise, returns a Tree instance.

        :raises UnexpectedInput: On a parse error, one of these sub-exceptions will rise:
                ``UnexpectedCharacters``, ``UnexpectedToken``, or ``UnexpectedEOF``.
                For convenience, these sub-exceptions also inherit from ``ParserError`` and ``LexerError``.


  */
  parse(text, start = null, on_error = null) {
    return this.parser.parse(text, start, on_error);
  }
}

//
// Indenter
//

class DedentError extends LarkError {
  // pass
}

class Indenter extends PostLex {
  constructor() {
    super();
    this.paren_level = 0;
    this.indent_level = [0];
  }

  *handle_NL(token) {
    if (this.paren_level > 0) {
      return;
    }

    yield token;
    let indent_str = rsplit(token.value, "\n", 1)[1];
    // Tabs and spaces
    let indent =
      str_count(indent_str, " ") + str_count(indent_str, "\t") * this.tab_len;
    if (indent > last_item(this.indent_level)) {
      this.indent_level.push(indent);
      yield Token.new_borrow_pos(this.INDENT_type, indent_str, token);
    } else {
      while (indent < last_item(this.indent_level)) {
        this.indent_level.pop();
        yield Token.new_borrow_pos(this.DEDENT_type, indent_str, token);
      }

      if (indent !== last_item(this.indent_level)) {
        throw new DedentError(
          format(
            "Unexpected dedent to column %s. Expected dedent to %s",
            indent,
            last_item(this.indent_level)
          )
        );
      }
    }
  }

  *_process(stream) {
    for (const token of stream) {
      if (token.type === this.NL_type) {
        yield* this.handle_NL(token);
      } else {
        yield token;
      }
      if (this.OPEN_PAREN_types.includes(token.type)) {
        this.paren_level += 1;
      } else if (this.CLOSE_PAREN_types.includes(token.type)) {
        this.paren_level -= 1;
      }
    }

    while (this.indent_level.length > 1) {
      this.indent_level.pop();
      yield new Token(this.DEDENT_type, "");
    }
  }

  process(stream) {
    this.paren_level = 0;
    this.indent_level = [0];
    return this._process(stream);
  }

  // XXX Hack for ContextualLexer. Maybe there's a more elegant solution?

  get always_accept() {
    return [this.NL_type];
  }

  get NL_type() {
    throw new NotImplementedError();
  }

  get OPEN_PAREN_types() {
    throw new NotImplementedError();
  }

  get CLOSE_PAREN_types() {
    throw new NotImplementedError();
  }

  get INDENT_type() {
    throw new NotImplementedError();
  }

  get DEDENT_type() {
    throw new NotImplementedError();
  }

  get tab_len() {
    throw new NotImplementedError();
  }
}

class PythonIndenter extends Indenter {
  static get NL_type() {
    return "_NEWLINE";
  }
  get NL_type() {
    return this.constructor.NL_type;
  }
  static get OPEN_PAREN_types() {
    return ["LPAR", "LSQB", "LBRACE"];
  }
  get OPEN_PAREN_types() {
    return this.constructor.OPEN_PAREN_types;
  }
  static get CLOSE_PAREN_types() {
    return ["RPAR", "RSQB", "RBRACE"];
  }
  get CLOSE_PAREN_types() {
    return this.constructor.CLOSE_PAREN_types;
  }
  static get INDENT_type() {
    return "_INDENT";
  }
  get INDENT_type() {
    return this.constructor.INDENT_type;
  }
  static get DEDENT_type() {
    return "_DEDENT";
  }
  get DEDENT_type() {
    return this.constructor.DEDENT_type;
  }
  static get tab_len() {
    return 8;
  }
  get tab_len() {
    return this.constructor.tab_len;
  }
}

const NAMESPACE = {
    Terminal: Terminal,
    NonTerminal: NonTerminal,
    RuleOptions: RuleOptions,
    PatternStr: PatternStr,
    PatternRE: PatternRE,
    TerminalDef: TerminalDef
}


var DATA={
  "parser": {
    "lexer_conf": {
      "terminals": [
        {
          "@": 0
        },
        {
          "@": 1
        },
        {
          "@": 2
        },
        {
          "@": 3
        },
        {
          "@": 4
        },
        {
          "@": 5
        },
        {
          "@": 6
        },
        {
          "@": 7
        },
        {
          "@": 8
        },
        {
          "@": 9
        },
        {
          "@": 10
        },
        {
          "@": 11
        },
        {
          "@": 12
        },
        {
          "@": 13
        }
      ],
      "ignore": [
        "WS"
      ],
      "g_regex_flags": 0,
      "use_bytes": false,
      "lexer_type": "contextual",
      "__type__": "LexerConf"
    },
    "parser_conf": {
      "rules": [
        {
          "@": 14
        },
        {
          "@": 15
        },
        {
          "@": 16
        },
        {
          "@": 17
        },
        {
          "@": 18
        },
        {
          "@": 19
        },
        {
          "@": 20
        },
        {
          "@": 21
        },
        {
          "@": 22
        },
        {
          "@": 23
        },
        {
          "@": 24
        },
        {
          "@": 25
        },
        {
          "@": 26
        },
        {
          "@": 27
        },
        {
          "@": 28
        },
        {
          "@": 29
        },
        {
          "@": 30
        },
        {
          "@": 31
        },
        {
          "@": 32
        },
        {
          "@": 33
        },
        {
          "@": 34
        },
        {
          "@": 35
        },
        {
          "@": 36
        },
        {
          "@": 37
        },
        {
          "@": 38
        },
        {
          "@": 39
        },
        {
          "@": 40
        },
        {
          "@": 41
        },
        {
          "@": 42
        },
        {
          "@": 43
        },
        {
          "@": 44
        },
        {
          "@": 45
        },
        {
          "@": 46
        },
        {
          "@": 47
        },
        {
          "@": 48
        },
        {
          "@": 49
        },
        {
          "@": 50
        },
        {
          "@": 51
        },
        {
          "@": 52
        },
        {
          "@": 53
        },
        {
          "@": 54
        }
      ],
      "start": [
        "start"
      ],
      "parser_type": "lalr",
      "__type__": "ParserConf"
    },
    "parser": {
      "tokens": {
        "0": "OP_0",
        "1": "RPAR",
        "2": "$END",
        "3": "COMMA",
        "4": "lassoc{expr_5,expr_6,OP_5}",
        "5": "expr_5",
        "6": "rassoc{expr_7,expr_8,OP_7}",
        "7": "expr_7",
        "8": "expr_literal",
        "9": "expr_0",
        "10": "LPAR",
        "11": "expr_4",
        "12": "NUMBER",
        "13": "ID",
        "14": "expr_8",
        "15": "lassoc{expr_1,expr_2,OP_1}",
        "16": "expr_3",
        "17": "unary{expr_6,expr_7,OP_6}",
        "18": "OP_6",
        "19": "nonassoc{expr_3,expr_4,OP_3}",
        "20": "expr_2",
        "21": "expr_others",
        "22": "expr_6",
        "23": "lassoc{expr_2,expr_3,OP_2}",
        "24": "var",
        "25": "expr",
        "26": "lassoc{expr_4,expr_5,OP_4}",
        "27": "number",
        "28": "lassoc{expr_0,expr_1,OP_0}",
        "29": "expr_1",
        "30": "expr_func_call",
        "31": "OP_5",
        "32": "OP_1",
        "33": "OP_4",
        "34": "OP_2",
        "35": "OP_3",
        "36": "OP_7",
        "37": "start",
        "38": "__expr_func_call_star_0"
      },
      "states": {
        "0": {
          "0": [
            0,
            19
          ],
          "1": [
            1,
            {
              "@": 15
            }
          ],
          "2": [
            1,
            {
              "@": 15
            }
          ],
          "3": [
            1,
            {
              "@": 15
            }
          ]
        },
        "1": {
          "4": [
            0,
            27
          ],
          "5": [
            0,
            51
          ],
          "6": [
            0,
            26
          ],
          "7": [
            0,
            15
          ],
          "8": [
            0,
            56
          ],
          "9": [
            0,
            0
          ],
          "10": [
            0,
            1
          ],
          "11": [
            0,
            57
          ],
          "12": [
            0,
            2
          ],
          "13": [
            0,
            7
          ],
          "14": [
            0,
            37
          ],
          "15": [
            0,
            52
          ],
          "16": [
            0,
            31
          ],
          "17": [
            0,
            33
          ],
          "18": [
            0,
            18
          ],
          "19": [
            0,
            24
          ],
          "20": [
            0,
            21
          ],
          "21": [
            0,
            8
          ],
          "22": [
            0,
            43
          ],
          "23": [
            0,
            44
          ],
          "24": [
            0,
            17
          ],
          "25": [
            0,
            9
          ],
          "26": [
            0,
            48
          ],
          "27": [
            0,
            38
          ],
          "28": [
            0,
            23
          ],
          "29": [
            0,
            28
          ],
          "30": [
            0,
            35
          ]
        },
        "2": {
          "31": [
            1,
            {
              "@": 36
            }
          ],
          "32": [
            1,
            {
              "@": 36
            }
          ],
          "33": [
            1,
            {
              "@": 36
            }
          ],
          "34": [
            1,
            {
              "@": 36
            }
          ],
          "35": [
            1,
            {
              "@": 36
            }
          ],
          "0": [
            1,
            {
              "@": 36
            }
          ],
          "36": [
            1,
            {
              "@": 36
            }
          ],
          "1": [
            1,
            {
              "@": 36
            }
          ],
          "3": [
            1,
            {
              "@": 36
            }
          ],
          "2": [
            1,
            {
              "@": 36
            }
          ]
        },
        "3": {
          "13": [
            0,
            7
          ],
          "6": [
            0,
            26
          ],
          "7": [
            0,
            15
          ],
          "21": [
            0,
            8
          ],
          "8": [
            0,
            56
          ],
          "10": [
            0,
            1
          ],
          "12": [
            0,
            2
          ],
          "24": [
            0,
            17
          ],
          "22": [
            0,
            4
          ],
          "14": [
            0,
            37
          ],
          "18": [
            0,
            18
          ],
          "27": [
            0,
            38
          ],
          "17": [
            0,
            33
          ],
          "30": [
            0,
            35
          ]
        },
        "4": {
          "31": [
            1,
            {
              "@": 47
            }
          ],
          "34": [
            1,
            {
              "@": 47
            }
          ],
          "35": [
            1,
            {
              "@": 47
            }
          ],
          "0": [
            1,
            {
              "@": 47
            }
          ],
          "32": [
            1,
            {
              "@": 47
            }
          ],
          "33": [
            1,
            {
              "@": 47
            }
          ],
          "1": [
            1,
            {
              "@": 47
            }
          ],
          "3": [
            1,
            {
              "@": 47
            }
          ],
          "2": [
            1,
            {
              "@": 47
            }
          ]
        },
        "5": {
          "13": [
            0,
            7
          ],
          "4": [
            0,
            27
          ],
          "6": [
            0,
            26
          ],
          "7": [
            0,
            15
          ],
          "21": [
            0,
            8
          ],
          "8": [
            0,
            56
          ],
          "10": [
            0,
            1
          ],
          "12": [
            0,
            2
          ],
          "22": [
            0,
            43
          ],
          "24": [
            0,
            17
          ],
          "14": [
            0,
            37
          ],
          "18": [
            0,
            18
          ],
          "27": [
            0,
            38
          ],
          "5": [
            0,
            45
          ],
          "17": [
            0,
            33
          ],
          "30": [
            0,
            35
          ]
        },
        "6": {
          "31": [
            1,
            {
              "@": 31
            }
          ],
          "32": [
            1,
            {
              "@": 31
            }
          ],
          "33": [
            1,
            {
              "@": 31
            }
          ],
          "34": [
            1,
            {
              "@": 31
            }
          ],
          "35": [
            1,
            {
              "@": 31
            }
          ],
          "0": [
            1,
            {
              "@": 31
            }
          ],
          "36": [
            1,
            {
              "@": 31
            }
          ],
          "1": [
            1,
            {
              "@": 31
            }
          ],
          "3": [
            1,
            {
              "@": 31
            }
          ],
          "2": [
            1,
            {
              "@": 31
            }
          ]
        },
        "7": {
          "10": [
            0,
            12
          ],
          "31": [
            1,
            {
              "@": 35
            }
          ],
          "32": [
            1,
            {
              "@": 35
            }
          ],
          "33": [
            1,
            {
              "@": 35
            }
          ],
          "34": [
            1,
            {
              "@": 35
            }
          ],
          "35": [
            1,
            {
              "@": 35
            }
          ],
          "0": [
            1,
            {
              "@": 35
            }
          ],
          "36": [
            1,
            {
              "@": 35
            }
          ],
          "1": [
            1,
            {
              "@": 35
            }
          ],
          "3": [
            1,
            {
              "@": 35
            }
          ],
          "2": [
            1,
            {
              "@": 35
            }
          ]
        },
        "8": {
          "31": [
            1,
            {
              "@": 24
            }
          ],
          "32": [
            1,
            {
              "@": 24
            }
          ],
          "33": [
            1,
            {
              "@": 24
            }
          ],
          "34": [
            1,
            {
              "@": 24
            }
          ],
          "35": [
            1,
            {
              "@": 24
            }
          ],
          "0": [
            1,
            {
              "@": 24
            }
          ],
          "36": [
            1,
            {
              "@": 24
            }
          ],
          "1": [
            1,
            {
              "@": 24
            }
          ],
          "3": [
            1,
            {
              "@": 24
            }
          ],
          "2": [
            1,
            {
              "@": 24
            }
          ]
        },
        "9": {
          "1": [
            0,
            39
          ]
        },
        "10": {
          "3": [
            1,
            {
              "@": 53
            }
          ],
          "1": [
            1,
            {
              "@": 53
            }
          ]
        },
        "11": {
          "4": [
            0,
            27
          ],
          "5": [
            0,
            51
          ],
          "6": [
            0,
            26
          ],
          "7": [
            0,
            15
          ],
          "8": [
            0,
            56
          ],
          "9": [
            0,
            0
          ],
          "10": [
            0,
            1
          ],
          "11": [
            0,
            57
          ],
          "12": [
            0,
            2
          ],
          "13": [
            0,
            7
          ],
          "14": [
            0,
            37
          ],
          "15": [
            0,
            52
          ],
          "16": [
            0,
            31
          ],
          "37": [
            0,
            32
          ],
          "17": [
            0,
            33
          ],
          "18": [
            0,
            18
          ],
          "19": [
            0,
            24
          ],
          "20": [
            0,
            21
          ],
          "21": [
            0,
            8
          ],
          "22": [
            0,
            43
          ],
          "23": [
            0,
            44
          ],
          "24": [
            0,
            17
          ],
          "25": [
            0,
            54
          ],
          "26": [
            0,
            48
          ],
          "27": [
            0,
            38
          ],
          "28": [
            0,
            23
          ],
          "29": [
            0,
            28
          ],
          "30": [
            0,
            35
          ]
        },
        "12": {
          "4": [
            0,
            27
          ],
          "5": [
            0,
            51
          ],
          "6": [
            0,
            26
          ],
          "7": [
            0,
            15
          ],
          "8": [
            0,
            56
          ],
          "10": [
            0,
            1
          ],
          "9": [
            0,
            0
          ],
          "11": [
            0,
            57
          ],
          "12": [
            0,
            2
          ],
          "13": [
            0,
            7
          ],
          "25": [
            0,
            40
          ],
          "14": [
            0,
            37
          ],
          "15": [
            0,
            52
          ],
          "16": [
            0,
            31
          ],
          "18": [
            0,
            18
          ],
          "17": [
            0,
            33
          ],
          "19": [
            0,
            24
          ],
          "20": [
            0,
            21
          ],
          "21": [
            0,
            8
          ],
          "22": [
            0,
            43
          ],
          "23": [
            0,
            44
          ],
          "24": [
            0,
            17
          ],
          "26": [
            0,
            48
          ],
          "27": [
            0,
            38
          ],
          "28": [
            0,
            23
          ],
          "1": [
            0,
            6
          ],
          "29": [
            0,
            28
          ],
          "30": [
            0,
            35
          ]
        },
        "13": {
          "0": [
            1,
            {
              "@": 41
            }
          ],
          "32": [
            1,
            {
              "@": 41
            }
          ],
          "34": [
            1,
            {
              "@": 41
            }
          ],
          "1": [
            1,
            {
              "@": 41
            }
          ],
          "2": [
            1,
            {
              "@": 41
            }
          ],
          "3": [
            1,
            {
              "@": 41
            }
          ]
        },
        "14": {
          "31": [
            1,
            {
              "@": 29
            }
          ],
          "32": [
            1,
            {
              "@": 29
            }
          ],
          "33": [
            1,
            {
              "@": 29
            }
          ],
          "34": [
            1,
            {
              "@": 29
            }
          ],
          "35": [
            1,
            {
              "@": 29
            }
          ],
          "0": [
            1,
            {
              "@": 29
            }
          ],
          "36": [
            1,
            {
              "@": 29
            }
          ],
          "1": [
            1,
            {
              "@": 29
            }
          ],
          "3": [
            1,
            {
              "@": 29
            }
          ],
          "2": [
            1,
            {
              "@": 29
            }
          ]
        },
        "15": {
          "31": [
            1,
            {
              "@": 50
            }
          ],
          "34": [
            1,
            {
              "@": 50
            }
          ],
          "35": [
            1,
            {
              "@": 50
            }
          ],
          "0": [
            1,
            {
              "@": 50
            }
          ],
          "32": [
            1,
            {
              "@": 50
            }
          ],
          "33": [
            1,
            {
              "@": 50
            }
          ],
          "1": [
            1,
            {
              "@": 50
            }
          ],
          "3": [
            1,
            {
              "@": 50
            }
          ],
          "2": [
            1,
            {
              "@": 50
            }
          ]
        },
        "16": {
          "13": [
            0,
            7
          ],
          "7": [
            0,
            41
          ],
          "6": [
            0,
            26
          ],
          "21": [
            0,
            8
          ],
          "8": [
            0,
            56
          ],
          "10": [
            0,
            1
          ],
          "12": [
            0,
            2
          ],
          "24": [
            0,
            17
          ],
          "14": [
            0,
            37
          ],
          "27": [
            0,
            38
          ],
          "30": [
            0,
            35
          ]
        },
        "17": {
          "31": [
            1,
            {
              "@": 33
            }
          ],
          "32": [
            1,
            {
              "@": 33
            }
          ],
          "33": [
            1,
            {
              "@": 33
            }
          ],
          "34": [
            1,
            {
              "@": 33
            }
          ],
          "35": [
            1,
            {
              "@": 33
            }
          ],
          "0": [
            1,
            {
              "@": 33
            }
          ],
          "36": [
            1,
            {
              "@": 33
            }
          ],
          "1": [
            1,
            {
              "@": 33
            }
          ],
          "3": [
            1,
            {
              "@": 33
            }
          ],
          "2": [
            1,
            {
              "@": 33
            }
          ]
        },
        "18": {
          "13": [
            0,
            7
          ],
          "6": [
            0,
            26
          ],
          "22": [
            0,
            36
          ],
          "7": [
            0,
            15
          ],
          "21": [
            0,
            8
          ],
          "8": [
            0,
            56
          ],
          "10": [
            0,
            1
          ],
          "12": [
            0,
            2
          ],
          "24": [
            0,
            17
          ],
          "14": [
            0,
            37
          ],
          "18": [
            0,
            18
          ],
          "27": [
            0,
            38
          ],
          "17": [
            0,
            33
          ],
          "30": [
            0,
            35
          ]
        },
        "19": {
          "4": [
            0,
            27
          ],
          "5": [
            0,
            51
          ],
          "6": [
            0,
            26
          ],
          "7": [
            0,
            15
          ],
          "8": [
            0,
            56
          ],
          "10": [
            0,
            1
          ],
          "12": [
            0,
            2
          ],
          "11": [
            0,
            57
          ],
          "13": [
            0,
            7
          ],
          "14": [
            0,
            37
          ],
          "15": [
            0,
            52
          ],
          "16": [
            0,
            31
          ],
          "18": [
            0,
            18
          ],
          "17": [
            0,
            33
          ],
          "29": [
            0,
            25
          ],
          "19": [
            0,
            24
          ],
          "20": [
            0,
            21
          ],
          "21": [
            0,
            8
          ],
          "22": [
            0,
            43
          ],
          "23": [
            0,
            44
          ],
          "24": [
            0,
            17
          ],
          "26": [
            0,
            48
          ],
          "27": [
            0,
            38
          ],
          "30": [
            0,
            35
          ]
        },
        "20": {
          "31": [
            1,
            {
              "@": 28
            }
          ],
          "32": [
            1,
            {
              "@": 28
            }
          ],
          "33": [
            1,
            {
              "@": 28
            }
          ],
          "34": [
            1,
            {
              "@": 28
            }
          ],
          "35": [
            1,
            {
              "@": 28
            }
          ],
          "0": [
            1,
            {
              "@": 28
            }
          ],
          "36": [
            1,
            {
              "@": 28
            }
          ],
          "1": [
            1,
            {
              "@": 28
            }
          ],
          "3": [
            1,
            {
              "@": 28
            }
          ],
          "2": [
            1,
            {
              "@": 28
            }
          ]
        },
        "21": {
          "34": [
            0,
            50
          ],
          "0": [
            1,
            {
              "@": 40
            }
          ],
          "32": [
            1,
            {
              "@": 40
            }
          ],
          "1": [
            1,
            {
              "@": 40
            }
          ],
          "2": [
            1,
            {
              "@": 40
            }
          ],
          "3": [
            1,
            {
              "@": 40
            }
          ]
        },
        "22": {
          "33": [
            0,
            5
          ],
          "0": [
            1,
            {
              "@": 43
            }
          ],
          "32": [
            1,
            {
              "@": 43
            }
          ],
          "34": [
            1,
            {
              "@": 43
            }
          ],
          "1": [
            1,
            {
              "@": 43
            }
          ],
          "2": [
            1,
            {
              "@": 43
            }
          ],
          "3": [
            1,
            {
              "@": 43
            }
          ]
        },
        "23": {
          "0": [
            1,
            {
              "@": 16
            }
          ],
          "1": [
            1,
            {
              "@": 16
            }
          ],
          "2": [
            1,
            {
              "@": 16
            }
          ],
          "3": [
            1,
            {
              "@": 16
            }
          ]
        },
        "24": {
          "0": [
            1,
            {
              "@": 19
            }
          ],
          "32": [
            1,
            {
              "@": 19
            }
          ],
          "34": [
            1,
            {
              "@": 19
            }
          ],
          "1": [
            1,
            {
              "@": 19
            }
          ],
          "2": [
            1,
            {
              "@": 19
            }
          ],
          "3": [
            1,
            {
              "@": 19
            }
          ]
        },
        "25": {
          "32": [
            0,
            47
          ],
          "0": [
            1,
            {
              "@": 37
            }
          ],
          "1": [
            1,
            {
              "@": 37
            }
          ],
          "2": [
            1,
            {
              "@": 37
            }
          ],
          "3": [
            1,
            {
              "@": 37
            }
          ]
        },
        "26": {
          "31": [
            1,
            {
              "@": 23
            }
          ],
          "34": [
            1,
            {
              "@": 23
            }
          ],
          "35": [
            1,
            {
              "@": 23
            }
          ],
          "0": [
            1,
            {
              "@": 23
            }
          ],
          "32": [
            1,
            {
              "@": 23
            }
          ],
          "33": [
            1,
            {
              "@": 23
            }
          ],
          "1": [
            1,
            {
              "@": 23
            }
          ],
          "3": [
            1,
            {
              "@": 23
            }
          ],
          "2": [
            1,
            {
              "@": 23
            }
          ]
        },
        "27": {
          "31": [
            1,
            {
              "@": 21
            }
          ],
          "34": [
            1,
            {
              "@": 21
            }
          ],
          "35": [
            1,
            {
              "@": 21
            }
          ],
          "0": [
            1,
            {
              "@": 21
            }
          ],
          "32": [
            1,
            {
              "@": 21
            }
          ],
          "33": [
            1,
            {
              "@": 21
            }
          ],
          "1": [
            1,
            {
              "@": 21
            }
          ],
          "3": [
            1,
            {
              "@": 21
            }
          ],
          "2": [
            1,
            {
              "@": 21
            }
          ]
        },
        "28": {
          "32": [
            0,
            47
          ],
          "0": [
            1,
            {
              "@": 38
            }
          ],
          "1": [
            1,
            {
              "@": 38
            }
          ],
          "2": [
            1,
            {
              "@": 38
            }
          ],
          "3": [
            1,
            {
              "@": 38
            }
          ]
        },
        "29": {
          "31": [
            1,
            {
              "@": 27
            }
          ],
          "32": [
            1,
            {
              "@": 27
            }
          ],
          "33": [
            1,
            {
              "@": 27
            }
          ],
          "34": [
            1,
            {
              "@": 27
            }
          ],
          "35": [
            1,
            {
              "@": 27
            }
          ],
          "0": [
            1,
            {
              "@": 27
            }
          ],
          "36": [
            1,
            {
              "@": 27
            }
          ],
          "1": [
            1,
            {
              "@": 27
            }
          ],
          "3": [
            1,
            {
              "@": 27
            }
          ],
          "2": [
            1,
            {
              "@": 27
            }
          ]
        },
        "30": {
          "31": [
            1,
            {
              "@": 30
            }
          ],
          "32": [
            1,
            {
              "@": 30
            }
          ],
          "33": [
            1,
            {
              "@": 30
            }
          ],
          "34": [
            1,
            {
              "@": 30
            }
          ],
          "35": [
            1,
            {
              "@": 30
            }
          ],
          "0": [
            1,
            {
              "@": 30
            }
          ],
          "36": [
            1,
            {
              "@": 30
            }
          ],
          "1": [
            1,
            {
              "@": 30
            }
          ],
          "3": [
            1,
            {
              "@": 30
            }
          ],
          "2": [
            1,
            {
              "@": 30
            }
          ]
        },
        "31": {
          "0": [
            1,
            {
              "@": 42
            }
          ],
          "32": [
            1,
            {
              "@": 42
            }
          ],
          "34": [
            1,
            {
              "@": 42
            }
          ],
          "1": [
            1,
            {
              "@": 42
            }
          ],
          "2": [
            1,
            {
              "@": 42
            }
          ],
          "3": [
            1,
            {
              "@": 42
            }
          ]
        },
        "32": {},
        "33": {
          "31": [
            1,
            {
              "@": 22
            }
          ],
          "34": [
            1,
            {
              "@": 22
            }
          ],
          "35": [
            1,
            {
              "@": 22
            }
          ],
          "0": [
            1,
            {
              "@": 22
            }
          ],
          "32": [
            1,
            {
              "@": 22
            }
          ],
          "33": [
            1,
            {
              "@": 22
            }
          ],
          "1": [
            1,
            {
              "@": 22
            }
          ],
          "3": [
            1,
            {
              "@": 22
            }
          ],
          "2": [
            1,
            {
              "@": 22
            }
          ]
        },
        "34": {
          "4": [
            0,
            27
          ],
          "5": [
            0,
            51
          ],
          "6": [
            0,
            26
          ],
          "7": [
            0,
            15
          ],
          "8": [
            0,
            56
          ],
          "9": [
            0,
            0
          ],
          "10": [
            0,
            1
          ],
          "11": [
            0,
            57
          ],
          "12": [
            0,
            2
          ],
          "30": [
            0,
            35
          ],
          "13": [
            0,
            7
          ],
          "14": [
            0,
            37
          ],
          "15": [
            0,
            52
          ],
          "16": [
            0,
            31
          ],
          "17": [
            0,
            33
          ],
          "18": [
            0,
            18
          ],
          "19": [
            0,
            24
          ],
          "20": [
            0,
            21
          ],
          "21": [
            0,
            8
          ],
          "22": [
            0,
            43
          ],
          "23": [
            0,
            44
          ],
          "24": [
            0,
            17
          ],
          "25": [
            0,
            42
          ],
          "26": [
            0,
            48
          ],
          "27": [
            0,
            38
          ],
          "28": [
            0,
            23
          ],
          "29": [
            0,
            28
          ],
          "1": [
            0,
            29
          ]
        },
        "35": {
          "31": [
            1,
            {
              "@": 25
            }
          ],
          "32": [
            1,
            {
              "@": 25
            }
          ],
          "33": [
            1,
            {
              "@": 25
            }
          ],
          "34": [
            1,
            {
              "@": 25
            }
          ],
          "35": [
            1,
            {
              "@": 25
            }
          ],
          "0": [
            1,
            {
              "@": 25
            }
          ],
          "36": [
            1,
            {
              "@": 25
            }
          ],
          "1": [
            1,
            {
              "@": 25
            }
          ],
          "3": [
            1,
            {
              "@": 25
            }
          ],
          "2": [
            1,
            {
              "@": 25
            }
          ]
        },
        "36": {
          "31": [
            1,
            {
              "@": 49
            }
          ],
          "34": [
            1,
            {
              "@": 49
            }
          ],
          "35": [
            1,
            {
              "@": 49
            }
          ],
          "0": [
            1,
            {
              "@": 49
            }
          ],
          "32": [
            1,
            {
              "@": 49
            }
          ],
          "33": [
            1,
            {
              "@": 49
            }
          ],
          "1": [
            1,
            {
              "@": 49
            }
          ],
          "3": [
            1,
            {
              "@": 49
            }
          ],
          "2": [
            1,
            {
              "@": 49
            }
          ]
        },
        "37": {
          "36": [
            0,
            16
          ],
          "31": [
            1,
            {
              "@": 52
            }
          ],
          "34": [
            1,
            {
              "@": 52
            }
          ],
          "35": [
            1,
            {
              "@": 52
            }
          ],
          "0": [
            1,
            {
              "@": 52
            }
          ],
          "32": [
            1,
            {
              "@": 52
            }
          ],
          "33": [
            1,
            {
              "@": 52
            }
          ],
          "1": [
            1,
            {
              "@": 52
            }
          ],
          "3": [
            1,
            {
              "@": 52
            }
          ],
          "2": [
            1,
            {
              "@": 52
            }
          ]
        },
        "38": {
          "31": [
            1,
            {
              "@": 32
            }
          ],
          "32": [
            1,
            {
              "@": 32
            }
          ],
          "33": [
            1,
            {
              "@": 32
            }
          ],
          "34": [
            1,
            {
              "@": 32
            }
          ],
          "35": [
            1,
            {
              "@": 32
            }
          ],
          "0": [
            1,
            {
              "@": 32
            }
          ],
          "36": [
            1,
            {
              "@": 32
            }
          ],
          "1": [
            1,
            {
              "@": 32
            }
          ],
          "3": [
            1,
            {
              "@": 32
            }
          ],
          "2": [
            1,
            {
              "@": 32
            }
          ]
        },
        "39": {
          "31": [
            1,
            {
              "@": 34
            }
          ],
          "32": [
            1,
            {
              "@": 34
            }
          ],
          "33": [
            1,
            {
              "@": 34
            }
          ],
          "34": [
            1,
            {
              "@": 34
            }
          ],
          "35": [
            1,
            {
              "@": 34
            }
          ],
          "0": [
            1,
            {
              "@": 34
            }
          ],
          "36": [
            1,
            {
              "@": 34
            }
          ],
          "1": [
            1,
            {
              "@": 34
            }
          ],
          "3": [
            1,
            {
              "@": 34
            }
          ],
          "2": [
            1,
            {
              "@": 34
            }
          ]
        },
        "40": {
          "38": [
            0,
            53
          ],
          "3": [
            0,
            46
          ],
          "1": [
            0,
            30
          ]
        },
        "41": {
          "31": [
            1,
            {
              "@": 51
            }
          ],
          "34": [
            1,
            {
              "@": 51
            }
          ],
          "35": [
            1,
            {
              "@": 51
            }
          ],
          "0": [
            1,
            {
              "@": 51
            }
          ],
          "32": [
            1,
            {
              "@": 51
            }
          ],
          "33": [
            1,
            {
              "@": 51
            }
          ],
          "1": [
            1,
            {
              "@": 51
            }
          ],
          "3": [
            1,
            {
              "@": 51
            }
          ],
          "2": [
            1,
            {
              "@": 51
            }
          ]
        },
        "42": {
          "3": [
            1,
            {
              "@": 54
            }
          ],
          "1": [
            1,
            {
              "@": 54
            }
          ]
        },
        "43": {
          "31": [
            1,
            {
              "@": 48
            }
          ],
          "34": [
            1,
            {
              "@": 48
            }
          ],
          "35": [
            1,
            {
              "@": 48
            }
          ],
          "0": [
            1,
            {
              "@": 48
            }
          ],
          "32": [
            1,
            {
              "@": 48
            }
          ],
          "33": [
            1,
            {
              "@": 48
            }
          ],
          "1": [
            1,
            {
              "@": 48
            }
          ],
          "3": [
            1,
            {
              "@": 48
            }
          ],
          "2": [
            1,
            {
              "@": 48
            }
          ]
        },
        "44": {
          "0": [
            1,
            {
              "@": 18
            }
          ],
          "32": [
            1,
            {
              "@": 18
            }
          ],
          "34": [
            1,
            {
              "@": 18
            }
          ],
          "1": [
            1,
            {
              "@": 18
            }
          ],
          "2": [
            1,
            {
              "@": 18
            }
          ],
          "3": [
            1,
            {
              "@": 18
            }
          ]
        },
        "45": {
          "31": [
            0,
            3
          ],
          "34": [
            1,
            {
              "@": 45
            }
          ],
          "35": [
            1,
            {
              "@": 45
            }
          ],
          "0": [
            1,
            {
              "@": 45
            }
          ],
          "32": [
            1,
            {
              "@": 45
            }
          ],
          "33": [
            1,
            {
              "@": 45
            }
          ],
          "1": [
            1,
            {
              "@": 45
            }
          ],
          "2": [
            1,
            {
              "@": 45
            }
          ],
          "3": [
            1,
            {
              "@": 45
            }
          ]
        },
        "46": {
          "4": [
            0,
            27
          ],
          "5": [
            0,
            51
          ],
          "6": [
            0,
            26
          ],
          "7": [
            0,
            15
          ],
          "8": [
            0,
            56
          ],
          "9": [
            0,
            0
          ],
          "10": [
            0,
            1
          ],
          "11": [
            0,
            57
          ],
          "12": [
            0,
            2
          ],
          "13": [
            0,
            7
          ],
          "14": [
            0,
            37
          ],
          "1": [
            0,
            14
          ],
          "15": [
            0,
            52
          ],
          "16": [
            0,
            31
          ],
          "17": [
            0,
            33
          ],
          "18": [
            0,
            18
          ],
          "19": [
            0,
            24
          ],
          "20": [
            0,
            21
          ],
          "21": [
            0,
            8
          ],
          "22": [
            0,
            43
          ],
          "25": [
            0,
            10
          ],
          "23": [
            0,
            44
          ],
          "24": [
            0,
            17
          ],
          "26": [
            0,
            48
          ],
          "27": [
            0,
            38
          ],
          "28": [
            0,
            23
          ],
          "29": [
            0,
            28
          ],
          "30": [
            0,
            35
          ]
        },
        "47": {
          "4": [
            0,
            27
          ],
          "5": [
            0,
            51
          ],
          "6": [
            0,
            26
          ],
          "7": [
            0,
            15
          ],
          "8": [
            0,
            56
          ],
          "10": [
            0,
            1
          ],
          "12": [
            0,
            2
          ],
          "11": [
            0,
            57
          ],
          "13": [
            0,
            7
          ],
          "14": [
            0,
            37
          ],
          "20": [
            0,
            55
          ],
          "16": [
            0,
            31
          ],
          "17": [
            0,
            33
          ],
          "18": [
            0,
            18
          ],
          "19": [
            0,
            24
          ],
          "21": [
            0,
            8
          ],
          "22": [
            0,
            43
          ],
          "23": [
            0,
            44
          ],
          "24": [
            0,
            17
          ],
          "26": [
            0,
            48
          ],
          "27": [
            0,
            38
          ],
          "30": [
            0,
            35
          ]
        },
        "48": {
          "34": [
            1,
            {
              "@": 20
            }
          ],
          "35": [
            1,
            {
              "@": 20
            }
          ],
          "0": [
            1,
            {
              "@": 20
            }
          ],
          "32": [
            1,
            {
              "@": 20
            }
          ],
          "33": [
            1,
            {
              "@": 20
            }
          ],
          "1": [
            1,
            {
              "@": 20
            }
          ],
          "2": [
            1,
            {
              "@": 20
            }
          ],
          "3": [
            1,
            {
              "@": 20
            }
          ]
        },
        "49": {
          "13": [
            0,
            7
          ],
          "4": [
            0,
            27
          ],
          "5": [
            0,
            51
          ],
          "6": [
            0,
            26
          ],
          "7": [
            0,
            15
          ],
          "21": [
            0,
            8
          ],
          "8": [
            0,
            56
          ],
          "10": [
            0,
            1
          ],
          "12": [
            0,
            2
          ],
          "11": [
            0,
            22
          ],
          "22": [
            0,
            43
          ],
          "24": [
            0,
            17
          ],
          "14": [
            0,
            37
          ],
          "26": [
            0,
            48
          ],
          "18": [
            0,
            18
          ],
          "27": [
            0,
            38
          ],
          "17": [
            0,
            33
          ],
          "30": [
            0,
            35
          ]
        },
        "50": {
          "13": [
            0,
            7
          ],
          "4": [
            0,
            27
          ],
          "5": [
            0,
            51
          ],
          "6": [
            0,
            26
          ],
          "7": [
            0,
            15
          ],
          "21": [
            0,
            8
          ],
          "8": [
            0,
            56
          ],
          "10": [
            0,
            1
          ],
          "12": [
            0,
            2
          ],
          "11": [
            0,
            57
          ],
          "22": [
            0,
            43
          ],
          "24": [
            0,
            17
          ],
          "14": [
            0,
            37
          ],
          "26": [
            0,
            48
          ],
          "18": [
            0,
            18
          ],
          "27": [
            0,
            38
          ],
          "16": [
            0,
            13
          ],
          "17": [
            0,
            33
          ],
          "19": [
            0,
            24
          ],
          "30": [
            0,
            35
          ]
        },
        "51": {
          "31": [
            0,
            3
          ],
          "34": [
            1,
            {
              "@": 46
            }
          ],
          "35": [
            1,
            {
              "@": 46
            }
          ],
          "0": [
            1,
            {
              "@": 46
            }
          ],
          "32": [
            1,
            {
              "@": 46
            }
          ],
          "33": [
            1,
            {
              "@": 46
            }
          ],
          "1": [
            1,
            {
              "@": 46
            }
          ],
          "2": [
            1,
            {
              "@": 46
            }
          ],
          "3": [
            1,
            {
              "@": 46
            }
          ]
        },
        "52": {
          "0": [
            1,
            {
              "@": 17
            }
          ],
          "32": [
            1,
            {
              "@": 17
            }
          ],
          "1": [
            1,
            {
              "@": 17
            }
          ],
          "2": [
            1,
            {
              "@": 17
            }
          ],
          "3": [
            1,
            {
              "@": 17
            }
          ]
        },
        "53": {
          "1": [
            0,
            20
          ],
          "3": [
            0,
            34
          ]
        },
        "54": {
          "2": [
            1,
            {
              "@": 14
            }
          ]
        },
        "55": {
          "34": [
            0,
            50
          ],
          "0": [
            1,
            {
              "@": 39
            }
          ],
          "32": [
            1,
            {
              "@": 39
            }
          ],
          "1": [
            1,
            {
              "@": 39
            }
          ],
          "2": [
            1,
            {
              "@": 39
            }
          ],
          "3": [
            1,
            {
              "@": 39
            }
          ]
        },
        "56": {
          "31": [
            1,
            {
              "@": 26
            }
          ],
          "32": [
            1,
            {
              "@": 26
            }
          ],
          "33": [
            1,
            {
              "@": 26
            }
          ],
          "34": [
            1,
            {
              "@": 26
            }
          ],
          "35": [
            1,
            {
              "@": 26
            }
          ],
          "0": [
            1,
            {
              "@": 26
            }
          ],
          "36": [
            1,
            {
              "@": 26
            }
          ],
          "1": [
            1,
            {
              "@": 26
            }
          ],
          "3": [
            1,
            {
              "@": 26
            }
          ],
          "2": [
            1,
            {
              "@": 26
            }
          ]
        },
        "57": {
          "33": [
            0,
            5
          ],
          "35": [
            0,
            49
          ],
          "0": [
            1,
            {
              "@": 44
            }
          ],
          "32": [
            1,
            {
              "@": 44
            }
          ],
          "34": [
            1,
            {
              "@": 44
            }
          ],
          "1": [
            1,
            {
              "@": 44
            }
          ],
          "2": [
            1,
            {
              "@": 44
            }
          ],
          "3": [
            1,
            {
              "@": 44
            }
          ]
        }
      },
      "start_states": {
        "start": 11
      },
      "end_states": {
        "start": 32
      }
    },
    "__type__": "ParsingFrontend"
  },
  "rules": [
    {
      "@": 14
    },
    {
      "@": 15
    },
    {
      "@": 16
    },
    {
      "@": 17
    },
    {
      "@": 18
    },
    {
      "@": 19
    },
    {
      "@": 20
    },
    {
      "@": 21
    },
    {
      "@": 22
    },
    {
      "@": 23
    },
    {
      "@": 24
    },
    {
      "@": 25
    },
    {
      "@": 26
    },
    {
      "@": 27
    },
    {
      "@": 28
    },
    {
      "@": 29
    },
    {
      "@": 30
    },
    {
      "@": 31
    },
    {
      "@": 32
    },
    {
      "@": 33
    },
    {
      "@": 34
    },
    {
      "@": 35
    },
    {
      "@": 36
    },
    {
      "@": 37
    },
    {
      "@": 38
    },
    {
      "@": 39
    },
    {
      "@": 40
    },
    {
      "@": 41
    },
    {
      "@": 42
    },
    {
      "@": 43
    },
    {
      "@": 44
    },
    {
      "@": 45
    },
    {
      "@": 46
    },
    {
      "@": 47
    },
    {
      "@": 48
    },
    {
      "@": 49
    },
    {
      "@": 50
    },
    {
      "@": 51
    },
    {
      "@": 52
    },
    {
      "@": 53
    },
    {
      "@": 54
    }
  ],
  "options": {
    "debug": false,
    "strict": false,
    "keep_all_tokens": false,
    "tree_class": null,
    "cache": false,
    "postlex": null,
    "parser": "lalr",
    "lexer": "contextual",
    "transformer": null,
    "start": [
      "start"
    ],
    "priority": "normal",
    "ambiguity": "auto",
    "regex": false,
    "propagate_positions": false,
    "lexer_callbacks": {},
    "maybe_placeholders": false,
    "edit_terminals": null,
    "g_regex_flags": 0,
    "use_bytes": false,
    "ordered_sets": true,
    "import_paths": [],
    "source_path": null,
    "_plugins": {}
  },
  "__type__": "Lark"
};

var MEMO={
  "0": {
    "name": "WS",
    "pattern": {
      "value": "(?:[ \t\f\r\n])+",
      "flags": [],
      "raw": null,
      "_width": [
        1,
        4294967295
      ],
      "__type__": "PatternRE"
    },
    "priority": 0,
    "__type__": "TerminalDef"
  },
  "1": {
    "name": "OP_0",
    "pattern": {
      "value": "|",
      "flags": [],
      "raw": "\"|\"",
      "__type__": "PatternStr"
    },
    "priority": 0,
    "__type__": "TerminalDef"
  },
  "2": {
    "name": "OP_1",
    "pattern": {
      "value": "^",
      "flags": [],
      "raw": "\"^\"",
      "__type__": "PatternStr"
    },
    "priority": 0,
    "__type__": "TerminalDef"
  },
  "3": {
    "name": "OP_2",
    "pattern": {
      "value": "&",
      "flags": [],
      "raw": "\"&\"",
      "__type__": "PatternStr"
    },
    "priority": 0,
    "__type__": "TerminalDef"
  },
  "4": {
    "name": "OP_3",
    "pattern": {
      "value": "(?:==|!=|<=|>=|<|>)",
      "flags": [],
      "raw": null,
      "_width": [
        1,
        2
      ],
      "__type__": "PatternRE"
    },
    "priority": 0,
    "__type__": "TerminalDef"
  },
  "5": {
    "name": "OP_4",
    "pattern": {
      "value": "(?:\\+|\\-)",
      "flags": [],
      "raw": null,
      "_width": [
        1,
        1
      ],
      "__type__": "PatternRE"
    },
    "priority": 0,
    "__type__": "TerminalDef"
  },
  "6": {
    "name": "OP_5",
    "pattern": {
      "value": "(?:\\*|/|%)",
      "flags": [],
      "raw": null,
      "_width": [
        1,
        1
      ],
      "__type__": "PatternRE"
    },
    "priority": 0,
    "__type__": "TerminalDef"
  },
  "7": {
    "name": "OP_6",
    "pattern": {
      "value": "(?:\\+|\\-|\\*|\\&|!|\\~)",
      "flags": [],
      "raw": null,
      "_width": [
        1,
        1
      ],
      "__type__": "PatternRE"
    },
    "priority": 0,
    "__type__": "TerminalDef"
  },
  "8": {
    "name": "OP_7",
    "pattern": {
      "value": "(?:\\*\\*|\\^)",
      "flags": [],
      "raw": null,
      "_width": [
        1,
        2
      ],
      "__type__": "PatternRE"
    },
    "priority": 0,
    "__type__": "TerminalDef"
  },
  "9": {
    "name": "ID",
    "pattern": {
      "value": "[a-zA-Z_][a-zA-Z0-9_]*",
      "flags": [],
      "raw": "/[a-zA-Z_][a-zA-Z0-9_]*/",
      "_width": [
        1,
        4294967295
      ],
      "__type__": "PatternRE"
    },
    "priority": 0,
    "__type__": "TerminalDef"
  },
  "10": {
    "name": "NUMBER",
    "pattern": {
      "value": "\\d+",
      "flags": [],
      "raw": "/\\d+/",
      "_width": [
        1,
        4294967295
      ],
      "__type__": "PatternRE"
    },
    "priority": 0,
    "__type__": "TerminalDef"
  },
  "11": {
    "name": "COMMA",
    "pattern": {
      "value": ",",
      "flags": [],
      "raw": "\",\"",
      "__type__": "PatternStr"
    },
    "priority": 0,
    "__type__": "TerminalDef"
  },
  "12": {
    "name": "LPAR",
    "pattern": {
      "value": "(",
      "flags": [],
      "raw": "\"(\"",
      "__type__": "PatternStr"
    },
    "priority": 0,
    "__type__": "TerminalDef"
  },
  "13": {
    "name": "RPAR",
    "pattern": {
      "value": ")",
      "flags": [],
      "raw": "\")\"",
      "__type__": "PatternStr"
    },
    "priority": 0,
    "__type__": "TerminalDef"
  },
  "14": {
    "origin": {
      "name": "start",
      "__type__": "NonTerminal"
    },
    "expansion": [
      {
        "name": "expr",
        "__type__": "NonTerminal"
      }
    ],
    "order": 0,
    "alias": null,
    "options": {
      "keep_all_tokens": false,
      "expand1": true,
      "priority": null,
      "template_source": null,
      "empty_indices": [],
      "__type__": "RuleOptions"
    },
    "__type__": "Rule"
  },
  "15": {
    "origin": {
      "name": "expr",
      "__type__": "NonTerminal"
    },
    "expansion": [
      {
        "name": "expr_0",
        "__type__": "NonTerminal"
      }
    ],
    "order": 0,
    "alias": null,
    "options": {
      "keep_all_tokens": false,
      "expand1": true,
      "priority": null,
      "template_source": null,
      "empty_indices": [],
      "__type__": "RuleOptions"
    },
    "__type__": "Rule"
  },
  "16": {
    "origin": {
      "name": "expr_0",
      "__type__": "NonTerminal"
    },
    "expansion": [
      {
        "name": "lassoc{expr_0,expr_1,OP_0}",
        "__type__": "NonTerminal"
      }
    ],
    "order": 0,
    "alias": null,
    "options": {
      "keep_all_tokens": false,
      "expand1": true,
      "priority": null,
      "template_source": null,
      "empty_indices": [],
      "__type__": "RuleOptions"
    },
    "__type__": "Rule"
  },
  "17": {
    "origin": {
      "name": "expr_1",
      "__type__": "NonTerminal"
    },
    "expansion": [
      {
        "name": "lassoc{expr_1,expr_2,OP_1}",
        "__type__": "NonTerminal"
      }
    ],
    "order": 0,
    "alias": null,
    "options": {
      "keep_all_tokens": false,
      "expand1": true,
      "priority": null,
      "template_source": null,
      "empty_indices": [],
      "__type__": "RuleOptions"
    },
    "__type__": "Rule"
  },
  "18": {
    "origin": {
      "name": "expr_2",
      "__type__": "NonTerminal"
    },
    "expansion": [
      {
        "name": "lassoc{expr_2,expr_3,OP_2}",
        "__type__": "NonTerminal"
      }
    ],
    "order": 0,
    "alias": null,
    "options": {
      "keep_all_tokens": false,
      "expand1": true,
      "priority": null,
      "template_source": null,
      "empty_indices": [],
      "__type__": "RuleOptions"
    },
    "__type__": "Rule"
  },
  "19": {
    "origin": {
      "name": "expr_3",
      "__type__": "NonTerminal"
    },
    "expansion": [
      {
        "name": "nonassoc{expr_3,expr_4,OP_3}",
        "__type__": "NonTerminal"
      }
    ],
    "order": 0,
    "alias": null,
    "options": {
      "keep_all_tokens": false,
      "expand1": true,
      "priority": null,
      "template_source": null,
      "empty_indices": [],
      "__type__": "RuleOptions"
    },
    "__type__": "Rule"
  },
  "20": {
    "origin": {
      "name": "expr_4",
      "__type__": "NonTerminal"
    },
    "expansion": [
      {
        "name": "lassoc{expr_4,expr_5,OP_4}",
        "__type__": "NonTerminal"
      }
    ],
    "order": 0,
    "alias": null,
    "options": {
      "keep_all_tokens": false,
      "expand1": true,
      "priority": null,
      "template_source": null,
      "empty_indices": [],
      "__type__": "RuleOptions"
    },
    "__type__": "Rule"
  },
  "21": {
    "origin": {
      "name": "expr_5",
      "__type__": "NonTerminal"
    },
    "expansion": [
      {
        "name": "lassoc{expr_5,expr_6,OP_5}",
        "__type__": "NonTerminal"
      }
    ],
    "order": 0,
    "alias": null,
    "options": {
      "keep_all_tokens": false,
      "expand1": true,
      "priority": null,
      "template_source": null,
      "empty_indices": [],
      "__type__": "RuleOptions"
    },
    "__type__": "Rule"
  },
  "22": {
    "origin": {
      "name": "expr_6",
      "__type__": "NonTerminal"
    },
    "expansion": [
      {
        "name": "unary{expr_6,expr_7,OP_6}",
        "__type__": "NonTerminal"
      }
    ],
    "order": 0,
    "alias": null,
    "options": {
      "keep_all_tokens": false,
      "expand1": true,
      "priority": null,
      "template_source": null,
      "empty_indices": [],
      "__type__": "RuleOptions"
    },
    "__type__": "Rule"
  },
  "23": {
    "origin": {
      "name": "expr_7",
      "__type__": "NonTerminal"
    },
    "expansion": [
      {
        "name": "rassoc{expr_7,expr_8,OP_7}",
        "__type__": "NonTerminal"
      }
    ],
    "order": 0,
    "alias": null,
    "options": {
      "keep_all_tokens": false,
      "expand1": true,
      "priority": null,
      "template_source": null,
      "empty_indices": [],
      "__type__": "RuleOptions"
    },
    "__type__": "Rule"
  },
  "24": {
    "origin": {
      "name": "expr_8",
      "__type__": "NonTerminal"
    },
    "expansion": [
      {
        "name": "expr_others",
        "__type__": "NonTerminal"
      }
    ],
    "order": 0,
    "alias": null,
    "options": {
      "keep_all_tokens": false,
      "expand1": true,
      "priority": null,
      "template_source": null,
      "empty_indices": [],
      "__type__": "RuleOptions"
    },
    "__type__": "Rule"
  },
  "25": {
    "origin": {
      "name": "expr_others",
      "__type__": "NonTerminal"
    },
    "expansion": [
      {
        "name": "expr_func_call",
        "__type__": "NonTerminal"
      }
    ],
    "order": 0,
    "alias": null,
    "options": {
      "keep_all_tokens": false,
      "expand1": true,
      "priority": null,
      "template_source": null,
      "empty_indices": [],
      "__type__": "RuleOptions"
    },
    "__type__": "Rule"
  },
  "26": {
    "origin": {
      "name": "expr_others",
      "__type__": "NonTerminal"
    },
    "expansion": [
      {
        "name": "expr_literal",
        "__type__": "NonTerminal"
      }
    ],
    "order": 1,
    "alias": null,
    "options": {
      "keep_all_tokens": false,
      "expand1": true,
      "priority": null,
      "template_source": null,
      "empty_indices": [],
      "__type__": "RuleOptions"
    },
    "__type__": "Rule"
  },
  "27": {
    "origin": {
      "name": "expr_func_call",
      "__type__": "NonTerminal"
    },
    "expansion": [
      {
        "name": "ID",
        "filter_out": false,
        "__type__": "Terminal"
      },
      {
        "name": "LPAR",
        "filter_out": true,
        "__type__": "Terminal"
      },
      {
        "name": "expr",
        "__type__": "NonTerminal"
      },
      {
        "name": "__expr_func_call_star_0",
        "__type__": "NonTerminal"
      },
      {
        "name": "COMMA",
        "filter_out": true,
        "__type__": "Terminal"
      },
      {
        "name": "RPAR",
        "filter_out": true,
        "__type__": "Terminal"
      }
    ],
    "order": 0,
    "alias": null,
    "options": {
      "keep_all_tokens": false,
      "expand1": false,
      "priority": null,
      "template_source": null,
      "empty_indices": [],
      "__type__": "RuleOptions"
    },
    "__type__": "Rule"
  },
  "28": {
    "origin": {
      "name": "expr_func_call",
      "__type__": "NonTerminal"
    },
    "expansion": [
      {
        "name": "ID",
        "filter_out": false,
        "__type__": "Terminal"
      },
      {
        "name": "LPAR",
        "filter_out": true,
        "__type__": "Terminal"
      },
      {
        "name": "expr",
        "__type__": "NonTerminal"
      },
      {
        "name": "__expr_func_call_star_0",
        "__type__": "NonTerminal"
      },
      {
        "name": "RPAR",
        "filter_out": true,
        "__type__": "Terminal"
      }
    ],
    "order": 1,
    "alias": null,
    "options": {
      "keep_all_tokens": false,
      "expand1": false,
      "priority": null,
      "template_source": null,
      "empty_indices": [],
      "__type__": "RuleOptions"
    },
    "__type__": "Rule"
  },
  "29": {
    "origin": {
      "name": "expr_func_call",
      "__type__": "NonTerminal"
    },
    "expansion": [
      {
        "name": "ID",
        "filter_out": false,
        "__type__": "Terminal"
      },
      {
        "name": "LPAR",
        "filter_out": true,
        "__type__": "Terminal"
      },
      {
        "name": "expr",
        "__type__": "NonTerminal"
      },
      {
        "name": "COMMA",
        "filter_out": true,
        "__type__": "Terminal"
      },
      {
        "name": "RPAR",
        "filter_out": true,
        "__type__": "Terminal"
      }
    ],
    "order": 2,
    "alias": null,
    "options": {
      "keep_all_tokens": false,
      "expand1": false,
      "priority": null,
      "template_source": null,
      "empty_indices": [],
      "__type__": "RuleOptions"
    },
    "__type__": "Rule"
  },
  "30": {
    "origin": {
      "name": "expr_func_call",
      "__type__": "NonTerminal"
    },
    "expansion": [
      {
        "name": "ID",
        "filter_out": false,
        "__type__": "Terminal"
      },
      {
        "name": "LPAR",
        "filter_out": true,
        "__type__": "Terminal"
      },
      {
        "name": "expr",
        "__type__": "NonTerminal"
      },
      {
        "name": "RPAR",
        "filter_out": true,
        "__type__": "Terminal"
      }
    ],
    "order": 3,
    "alias": null,
    "options": {
      "keep_all_tokens": false,
      "expand1": false,
      "priority": null,
      "template_source": null,
      "empty_indices": [],
      "__type__": "RuleOptions"
    },
    "__type__": "Rule"
  },
  "31": {
    "origin": {
      "name": "expr_func_call",
      "__type__": "NonTerminal"
    },
    "expansion": [
      {
        "name": "ID",
        "filter_out": false,
        "__type__": "Terminal"
      },
      {
        "name": "LPAR",
        "filter_out": true,
        "__type__": "Terminal"
      },
      {
        "name": "RPAR",
        "filter_out": true,
        "__type__": "Terminal"
      }
    ],
    "order": 4,
    "alias": null,
    "options": {
      "keep_all_tokens": false,
      "expand1": false,
      "priority": null,
      "template_source": null,
      "empty_indices": [],
      "__type__": "RuleOptions"
    },
    "__type__": "Rule"
  },
  "32": {
    "origin": {
      "name": "expr_literal",
      "__type__": "NonTerminal"
    },
    "expansion": [
      {
        "name": "number",
        "__type__": "NonTerminal"
      }
    ],
    "order": 0,
    "alias": null,
    "options": {
      "keep_all_tokens": false,
      "expand1": true,
      "priority": null,
      "template_source": null,
      "empty_indices": [],
      "__type__": "RuleOptions"
    },
    "__type__": "Rule"
  },
  "33": {
    "origin": {
      "name": "expr_literal",
      "__type__": "NonTerminal"
    },
    "expansion": [
      {
        "name": "var",
        "__type__": "NonTerminal"
      }
    ],
    "order": 1,
    "alias": null,
    "options": {
      "keep_all_tokens": false,
      "expand1": true,
      "priority": null,
      "template_source": null,
      "empty_indices": [],
      "__type__": "RuleOptions"
    },
    "__type__": "Rule"
  },
  "34": {
    "origin": {
      "name": "expr_literal",
      "__type__": "NonTerminal"
    },
    "expansion": [
      {
        "name": "LPAR",
        "filter_out": true,
        "__type__": "Terminal"
      },
      {
        "name": "expr",
        "__type__": "NonTerminal"
      },
      {
        "name": "RPAR",
        "filter_out": true,
        "__type__": "Terminal"
      }
    ],
    "order": 2,
    "alias": null,
    "options": {
      "keep_all_tokens": false,
      "expand1": true,
      "priority": null,
      "template_source": null,
      "empty_indices": [],
      "__type__": "RuleOptions"
    },
    "__type__": "Rule"
  },
  "35": {
    "origin": {
      "name": "var",
      "__type__": "NonTerminal"
    },
    "expansion": [
      {
        "name": "ID",
        "filter_out": false,
        "__type__": "Terminal"
      }
    ],
    "order": 0,
    "alias": null,
    "options": {
      "keep_all_tokens": false,
      "expand1": false,
      "priority": null,
      "template_source": null,
      "empty_indices": [],
      "__type__": "RuleOptions"
    },
    "__type__": "Rule"
  },
  "36": {
    "origin": {
      "name": "number",
      "__type__": "NonTerminal"
    },
    "expansion": [
      {
        "name": "NUMBER",
        "filter_out": false,
        "__type__": "Terminal"
      }
    ],
    "order": 0,
    "alias": null,
    "options": {
      "keep_all_tokens": false,
      "expand1": false,
      "priority": null,
      "template_source": null,
      "empty_indices": [],
      "__type__": "RuleOptions"
    },
    "__type__": "Rule"
  },
  "37": {
    "origin": {
      "name": "lassoc{expr_0,expr_1,OP_0}",
      "__type__": "NonTerminal"
    },
    "expansion": [
      {
        "name": "expr_0",
        "__type__": "NonTerminal"
      },
      {
        "name": "OP_0",
        "filter_out": false,
        "__type__": "Terminal"
      },
      {
        "name": "expr_1",
        "__type__": "NonTerminal"
      }
    ],
    "order": 0,
    "alias": "expr_binary",
    "options": {
      "keep_all_tokens": false,
      "expand1": true,
      "priority": null,
      "template_source": "lassoc",
      "empty_indices": [],
      "__type__": "RuleOptions"
    },
    "__type__": "Rule"
  },
  "38": {
    "origin": {
      "name": "lassoc{expr_0,expr_1,OP_0}",
      "__type__": "NonTerminal"
    },
    "expansion": [
      {
        "name": "expr_1",
        "__type__": "NonTerminal"
      }
    ],
    "order": 1,
    "alias": null,
    "options": {
      "keep_all_tokens": false,
      "expand1": true,
      "priority": null,
      "template_source": "lassoc",
      "empty_indices": [],
      "__type__": "RuleOptions"
    },
    "__type__": "Rule"
  },
  "39": {
    "origin": {
      "name": "lassoc{expr_1,expr_2,OP_1}",
      "__type__": "NonTerminal"
    },
    "expansion": [
      {
        "name": "expr_1",
        "__type__": "NonTerminal"
      },
      {
        "name": "OP_1",
        "filter_out": false,
        "__type__": "Terminal"
      },
      {
        "name": "expr_2",
        "__type__": "NonTerminal"
      }
    ],
    "order": 0,
    "alias": "expr_binary",
    "options": {
      "keep_all_tokens": false,
      "expand1": true,
      "priority": null,
      "template_source": "lassoc",
      "empty_indices": [],
      "__type__": "RuleOptions"
    },
    "__type__": "Rule"
  },
  "40": {
    "origin": {
      "name": "lassoc{expr_1,expr_2,OP_1}",
      "__type__": "NonTerminal"
    },
    "expansion": [
      {
        "name": "expr_2",
        "__type__": "NonTerminal"
      }
    ],
    "order": 1,
    "alias": null,
    "options": {
      "keep_all_tokens": false,
      "expand1": true,
      "priority": null,
      "template_source": "lassoc",
      "empty_indices": [],
      "__type__": "RuleOptions"
    },
    "__type__": "Rule"
  },
  "41": {
    "origin": {
      "name": "lassoc{expr_2,expr_3,OP_2}",
      "__type__": "NonTerminal"
    },
    "expansion": [
      {
        "name": "expr_2",
        "__type__": "NonTerminal"
      },
      {
        "name": "OP_2",
        "filter_out": false,
        "__type__": "Terminal"
      },
      {
        "name": "expr_3",
        "__type__": "NonTerminal"
      }
    ],
    "order": 0,
    "alias": "expr_binary",
    "options": {
      "keep_all_tokens": false,
      "expand1": true,
      "priority": null,
      "template_source": "lassoc",
      "empty_indices": [],
      "__type__": "RuleOptions"
    },
    "__type__": "Rule"
  },
  "42": {
    "origin": {
      "name": "lassoc{expr_2,expr_3,OP_2}",
      "__type__": "NonTerminal"
    },
    "expansion": [
      {
        "name": "expr_3",
        "__type__": "NonTerminal"
      }
    ],
    "order": 1,
    "alias": null,
    "options": {
      "keep_all_tokens": false,
      "expand1": true,
      "priority": null,
      "template_source": "lassoc",
      "empty_indices": [],
      "__type__": "RuleOptions"
    },
    "__type__": "Rule"
  },
  "43": {
    "origin": {
      "name": "nonassoc{expr_3,expr_4,OP_3}",
      "__type__": "NonTerminal"
    },
    "expansion": [
      {
        "name": "expr_4",
        "__type__": "NonTerminal"
      },
      {
        "name": "OP_3",
        "filter_out": false,
        "__type__": "Terminal"
      },
      {
        "name": "expr_4",
        "__type__": "NonTerminal"
      }
    ],
    "order": 0,
    "alias": "expr_binary",
    "options": {
      "keep_all_tokens": false,
      "expand1": true,
      "priority": null,
      "template_source": "nonassoc",
      "empty_indices": [],
      "__type__": "RuleOptions"
    },
    "__type__": "Rule"
  },
  "44": {
    "origin": {
      "name": "nonassoc{expr_3,expr_4,OP_3}",
      "__type__": "NonTerminal"
    },
    "expansion": [
      {
        "name": "expr_4",
        "__type__": "NonTerminal"
      }
    ],
    "order": 1,
    "alias": null,
    "options": {
      "keep_all_tokens": false,
      "expand1": true,
      "priority": null,
      "template_source": "nonassoc",
      "empty_indices": [],
      "__type__": "RuleOptions"
    },
    "__type__": "Rule"
  },
  "45": {
    "origin": {
      "name": "lassoc{expr_4,expr_5,OP_4}",
      "__type__": "NonTerminal"
    },
    "expansion": [
      {
        "name": "expr_4",
        "__type__": "NonTerminal"
      },
      {
        "name": "OP_4",
        "filter_out": false,
        "__type__": "Terminal"
      },
      {
        "name": "expr_5",
        "__type__": "NonTerminal"
      }
    ],
    "order": 0,
    "alias": "expr_binary",
    "options": {
      "keep_all_tokens": false,
      "expand1": true,
      "priority": null,
      "template_source": "lassoc",
      "empty_indices": [],
      "__type__": "RuleOptions"
    },
    "__type__": "Rule"
  },
  "46": {
    "origin": {
      "name": "lassoc{expr_4,expr_5,OP_4}",
      "__type__": "NonTerminal"
    },
    "expansion": [
      {
        "name": "expr_5",
        "__type__": "NonTerminal"
      }
    ],
    "order": 1,
    "alias": null,
    "options": {
      "keep_all_tokens": false,
      "expand1": true,
      "priority": null,
      "template_source": "lassoc",
      "empty_indices": [],
      "__type__": "RuleOptions"
    },
    "__type__": "Rule"
  },
  "47": {
    "origin": {
      "name": "lassoc{expr_5,expr_6,OP_5}",
      "__type__": "NonTerminal"
    },
    "expansion": [
      {
        "name": "expr_5",
        "__type__": "NonTerminal"
      },
      {
        "name": "OP_5",
        "filter_out": false,
        "__type__": "Terminal"
      },
      {
        "name": "expr_6",
        "__type__": "NonTerminal"
      }
    ],
    "order": 0,
    "alias": "expr_binary",
    "options": {
      "keep_all_tokens": false,
      "expand1": true,
      "priority": null,
      "template_source": "lassoc",
      "empty_indices": [],
      "__type__": "RuleOptions"
    },
    "__type__": "Rule"
  },
  "48": {
    "origin": {
      "name": "lassoc{expr_5,expr_6,OP_5}",
      "__type__": "NonTerminal"
    },
    "expansion": [
      {
        "name": "expr_6",
        "__type__": "NonTerminal"
      }
    ],
    "order": 1,
    "alias": null,
    "options": {
      "keep_all_tokens": false,
      "expand1": true,
      "priority": null,
      "template_source": "lassoc",
      "empty_indices": [],
      "__type__": "RuleOptions"
    },
    "__type__": "Rule"
  },
  "49": {
    "origin": {
      "name": "unary{expr_6,expr_7,OP_6}",
      "__type__": "NonTerminal"
    },
    "expansion": [
      {
        "name": "OP_6",
        "filter_out": false,
        "__type__": "Terminal"
      },
      {
        "name": "expr_6",
        "__type__": "NonTerminal"
      }
    ],
    "order": 0,
    "alias": "expr_unary",
    "options": {
      "keep_all_tokens": false,
      "expand1": true,
      "priority": null,
      "template_source": "unary",
      "empty_indices": [],
      "__type__": "RuleOptions"
    },
    "__type__": "Rule"
  },
  "50": {
    "origin": {
      "name": "unary{expr_6,expr_7,OP_6}",
      "__type__": "NonTerminal"
    },
    "expansion": [
      {
        "name": "expr_7",
        "__type__": "NonTerminal"
      }
    ],
    "order": 1,
    "alias": null,
    "options": {
      "keep_all_tokens": false,
      "expand1": true,
      "priority": null,
      "template_source": "unary",
      "empty_indices": [],
      "__type__": "RuleOptions"
    },
    "__type__": "Rule"
  },
  "51": {
    "origin": {
      "name": "rassoc{expr_7,expr_8,OP_7}",
      "__type__": "NonTerminal"
    },
    "expansion": [
      {
        "name": "expr_8",
        "__type__": "NonTerminal"
      },
      {
        "name": "OP_7",
        "filter_out": false,
        "__type__": "Terminal"
      },
      {
        "name": "expr_7",
        "__type__": "NonTerminal"
      }
    ],
    "order": 0,
    "alias": "expr_binary",
    "options": {
      "keep_all_tokens": false,
      "expand1": true,
      "priority": null,
      "template_source": "rassoc",
      "empty_indices": [],
      "__type__": "RuleOptions"
    },
    "__type__": "Rule"
  },
  "52": {
    "origin": {
      "name": "rassoc{expr_7,expr_8,OP_7}",
      "__type__": "NonTerminal"
    },
    "expansion": [
      {
        "name": "expr_8",
        "__type__": "NonTerminal"
      }
    ],
    "order": 1,
    "alias": null,
    "options": {
      "keep_all_tokens": false,
      "expand1": true,
      "priority": null,
      "template_source": "rassoc",
      "empty_indices": [],
      "__type__": "RuleOptions"
    },
    "__type__": "Rule"
  },
  "53": {
    "origin": {
      "name": "__expr_func_call_star_0",
      "__type__": "NonTerminal"
    },
    "expansion": [
      {
        "name": "COMMA",
        "filter_out": true,
        "__type__": "Terminal"
      },
      {
        "name": "expr",
        "__type__": "NonTerminal"
      }
    ],
    "order": 0,
    "alias": null,
    "options": {
      "keep_all_tokens": false,
      "expand1": false,
      "priority": null,
      "template_source": null,
      "empty_indices": [],
      "__type__": "RuleOptions"
    },
    "__type__": "Rule"
  },
  "54": {
    "origin": {
      "name": "__expr_func_call_star_0",
      "__type__": "NonTerminal"
    },
    "expansion": [
      {
        "name": "__expr_func_call_star_0",
        "__type__": "NonTerminal"
      },
      {
        "name": "COMMA",
        "filter_out": true,
        "__type__": "Terminal"
      },
      {
        "name": "expr",
        "__type__": "NonTerminal"
      }
    ],
    "order": 1,
    "alias": null,
    "options": {
      "keep_all_tokens": false,
      "expand1": false,
      "priority": null,
      "template_source": null,
      "empty_indices": [],
      "__type__": "RuleOptions"
    },
    "__type__": "Rule"
  }
};

export default {parser, get_parser, _get_match, Scanner, _Parser, } 
