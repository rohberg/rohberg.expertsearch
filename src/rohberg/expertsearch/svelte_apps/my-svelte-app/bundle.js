
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
(function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    const active_docs = new Set();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = node.ownerDocument;
        active_docs.add(doc);
        const stylesheet = doc.__svelte_stylesheet || (doc.__svelte_stylesheet = doc.head.appendChild(element('style')).sheet);
        const current_rules = doc.__svelte_rules || (doc.__svelte_rules = {});
        if (!current_rules[name]) {
            current_rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            active_docs.forEach(doc => {
                const stylesheet = doc.__svelte_stylesheet;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                doc.__svelte_rules = {};
            });
            active_docs.clear();
        });
    }

    function create_animation(node, from, fn, params) {
        if (!from)
            return noop;
        const to = node.getBoundingClientRect();
        if (from.left === to.left && from.right === to.right && from.top === to.top && from.bottom === to.bottom)
            return noop;
        const { delay = 0, duration = 300, easing = identity, 
        // @ts-ignore todo: should this be separated from destructuring? Or start/end added to public api and documentation?
        start: start_time = now() + delay, 
        // @ts-ignore todo:
        end = start_time + duration, tick = noop, css } = fn(node, { from, to }, params);
        let running = true;
        let started = false;
        let name;
        function start() {
            if (css) {
                name = create_rule(node, 0, 1, duration, delay, easing, css);
            }
            if (!delay) {
                started = true;
            }
        }
        function stop() {
            if (css)
                delete_rule(node, name);
            running = false;
        }
        loop(now => {
            if (!started && now >= start_time) {
                started = true;
            }
            if (started && now >= end) {
                tick(1, 0);
                stop();
            }
            if (!running) {
                return false;
            }
            if (started) {
                const p = now - start_time;
                const t = 0 + 1 * easing(p / duration);
                tick(t, 1 - t);
            }
            return true;
        });
        start();
        tick(0, 1);
        return stop;
    }
    function fix_position(node) {
        const style = getComputedStyle(node);
        if (style.position !== 'absolute' && style.position !== 'fixed') {
            const { width, height } = style;
            const a = node.getBoundingClientRect();
            node.style.position = 'absolute';
            node.style.width = width;
            node.style.height = height;
            add_transform(node, a);
        }
    }
    function add_transform(node, a) {
        const b = node.getBoundingClientRect();
        if (a.left !== b.left || a.top !== b.top) {
            const style = getComputedStyle(node);
            const transform = style.transform === 'none' ? '' : style.transform;
            node.style.transform = `${transform} translate(${a.left - b.left}px, ${a.top - b.top}px)`;
        }
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_bidirectional_transition(node, fn, params, intro) {
        let config = fn(node, params);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = program.b - t;
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            const program = {
                start: now() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program || pending_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch(node, b, 'start'));
                loop(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro — we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro — needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait().then(() => {
                        // @ts-ignore
                        config = config();
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function fix_and_outro_and_destroy_block(block, lookup) {
        block.f();
        outro_and_destroy_block(block, lookup);
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.29.7' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    function scale(node, { delay = 0, duration = 400, easing = cubicOut, start = 0, opacity = 0 }) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const sd = 1 - start;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (_t, u) => `
			transform: ${transform} scale(${1 - (sd * u)});
			opacity: ${target_opacity - (od * u)}
		`
        };
    }

    function flip(node, animation, params) {
        const style = getComputedStyle(node);
        const transform = style.transform === 'none' ? '' : style.transform;
        const scaleX = animation.from.width / node.clientWidth;
        const scaleY = animation.from.height / node.clientHeight;
        const dx = (animation.from.left - animation.to.left) / scaleX;
        const dy = (animation.from.top - animation.to.top) / scaleY;
        const d = Math.sqrt(dx * dx + dy * dy);
        const { delay = 0, duration = (d) => Math.sqrt(d) * 120, easing = cubicOut } = params;
        return {
            delay,
            duration: is_function(duration) ? duration(d) : duration,
            easing,
            css: (_t, u) => `transform: ${transform} translate(${u * dx}px, ${u * dy}px);`
        };
    }

    /* src/ExpertSearch.svelte generated by Svelte v3.29.7 */

    const { Error: Error_1, console: console_1 } = globals;
    const file = "src/ExpertSearch.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[10] = list[i];
    	child_ctx[12] = i;
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[13] = list[i];
    	return child_ctx;
    }

    // (75:2) {#each menuregions as menuregion}
    function create_each_block_1(ctx) {
    	let input;
    	let input_value_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "type", "button");
    			attr_dev(input, "class", "regionbutton svelte-14hoyc1");
    			input.value = input_value_value = /*menuregion*/ ctx[13];
    			toggle_class(input, "selected", /*region*/ ctx[1] === /*menuregion*/ ctx[13]);
    			add_location(input, file, 75, 4, 1975);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);

    			if (!mounted) {
    				dispose = listen_dev(input, "click", prevent_default(/*handleClickRegion*/ ctx[4]), false, true, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*region, menuregions*/ 10) {
    				toggle_class(input, "selected", /*region*/ ctx[1] === /*menuregion*/ ctx[13]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(75:2) {#each menuregions as menuregion}",
    		ctx
    	});

    	return block;
    }

    // (84:26) {#if searchstring}
    function create_if_block(ctx) {
    	let t0_value = " " + "";
    	let t0;
    	let t1;
    	let t2;

    	const block = {
    		c: function create() {
    			t0 = text(t0_value);
    			t1 = text("for ");
    			t2 = text(/*searchstring*/ ctx[0]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, t2, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*searchstring*/ 1) set_data_dev(t2, /*searchstring*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(t2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(84:26) {#if searchstring}",
    		ctx
    	});

    	return block;
    }

    // (103:2) {:else}
    function create_else_block(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "Keine Experten gefunden";
    			add_location(p, file, 103, 4, 2915);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(103:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (93:2) {#each experts as expert, i (expert['@id'])}
    function create_each_block(key_1, ctx) {
    	let div5;
    	let div0;
    	let img;
    	let img_src_value;
    	let t0;
    	let div1;
    	let t1_value = /*expert*/ ctx[10].first_name + "";
    	let t1;
    	let t2;
    	let t3_value = /*expert*/ ctx[10].last_name + "";
    	let t3;
    	let t4;
    	let div2;
    	let t5_value = /*expert*/ ctx[10].competence + "";
    	let t5;
    	let t6;
    	let div3;
    	let t7_value = /*expert*/ ctx[10].organisation + "";
    	let t7;
    	let t8;
    	let div4;
    	let t9_value = /*expert*/ ctx[10].region + "";
    	let t9;
    	let t10;
    	let div5_transition;
    	let rect;
    	let stop_animation = noop;
    	let current;

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			div5 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			div1 = element("div");
    			t1 = text(t1_value);
    			t2 = space();
    			t3 = text(t3_value);
    			t4 = space();
    			div2 = element("div");
    			t5 = text(t5_value);
    			t6 = space();
    			div3 = element("div");
    			t7 = text(t7_value);
    			t8 = space();
    			div4 = element("div");
    			t9 = text(t9_value);
    			t10 = space();
    			if (img.src !== (img_src_value = /*expert*/ ctx[10].image?.download || "")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Portrait");
    			attr_dev(img, "class", "svelte-14hoyc1");
    			add_location(img, file, 95, 8, 2580);
    			attr_dev(div0, "class", "portrait svelte-14hoyc1");
    			add_location(div0, file, 94, 6, 2549);
    			attr_dev(div1, "class", "fullname svelte-14hoyc1");
    			add_location(div1, file, 97, 6, 2659);
    			attr_dev(div2, "class", "competence svelte-14hoyc1");
    			add_location(div2, file, 98, 6, 2732);
    			attr_dev(div3, "class", "organisation svelte-14hoyc1");
    			add_location(div3, file, 99, 6, 2788);
    			attr_dev(div4, "class", "region svelte-14hoyc1");
    			add_location(div4, file, 100, 6, 2848);
    			attr_dev(div5, "class", "card svelte-14hoyc1");
    			add_location(div5, file, 93, 4, 2474);
    			this.first = div5;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div0);
    			append_dev(div0, img);
    			append_dev(div5, t0);
    			append_dev(div5, div1);
    			append_dev(div1, t1);
    			append_dev(div1, t2);
    			append_dev(div1, t3);
    			append_dev(div5, t4);
    			append_dev(div5, div2);
    			append_dev(div2, t5);
    			append_dev(div5, t6);
    			append_dev(div5, div3);
    			append_dev(div3, t7);
    			append_dev(div5, t8);
    			append_dev(div5, div4);
    			append_dev(div4, t9);
    			append_dev(div5, t10);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*experts*/ 4 && img.src !== (img_src_value = /*expert*/ ctx[10].image?.download || "")) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if ((!current || dirty & /*experts*/ 4) && t1_value !== (t1_value = /*expert*/ ctx[10].first_name + "")) set_data_dev(t1, t1_value);
    			if ((!current || dirty & /*experts*/ 4) && t3_value !== (t3_value = /*expert*/ ctx[10].last_name + "")) set_data_dev(t3, t3_value);
    			if ((!current || dirty & /*experts*/ 4) && t5_value !== (t5_value = /*expert*/ ctx[10].competence + "")) set_data_dev(t5, t5_value);
    			if ((!current || dirty & /*experts*/ 4) && t7_value !== (t7_value = /*expert*/ ctx[10].organisation + "")) set_data_dev(t7, t7_value);
    			if ((!current || dirty & /*experts*/ 4) && t9_value !== (t9_value = /*expert*/ ctx[10].region + "")) set_data_dev(t9, t9_value);
    		},
    		r: function measure() {
    			rect = div5.getBoundingClientRect();
    		},
    		f: function fix() {
    			fix_position(div5);
    			stop_animation();
    			add_transform(div5, rect);
    		},
    		a: function animate() {
    			stop_animation();
    			stop_animation = create_animation(div5, rect, flip, { duration: 300 });
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!div5_transition) div5_transition = create_bidirectional_transition(div5, scale, {}, true);
    				div5_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!div5_transition) div5_transition = create_bidirectional_transition(div5, scale, {}, false);
    			div5_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div5);
    			if (detaching && div5_transition) div5_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(93:2) {#each experts as expert, i (expert['@id'])}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let h2;
    	let t1;
    	let form;
    	let input;
    	let t2;
    	let br0;
    	let t3;
    	let t4;
    	let p;
    	let i;
    	let t5;
    	let t6;
    	let t7;
    	let t8;
    	let div0;
    	let t9;
    	let t10;
    	let br1;
    	let t11;
    	let t12;
    	let br2;
    	let t13;
    	let div1;
    	let each_blocks = [];
    	let each1_lookup = new Map();
    	let current;
    	let mounted;
    	let dispose;
    	let each_value_1 = /*menuregions*/ ctx[3];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	let if_block = /*searchstring*/ ctx[0] && create_if_block(ctx);
    	let each_value = /*experts*/ ctx[2];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*expert*/ ctx[10]["@id"];
    	validate_each_keys(ctx, each_value, get_each_context, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
    	}

    	let each1_else = null;

    	if (!each_value.length) {
    		each1_else = create_else_block(ctx);
    	}

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			h2.textContent = "Expert Search";
    			t1 = space();
    			form = element("form");
    			input = element("input");
    			t2 = space();
    			br0 = element("br");
    			t3 = space();

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t4 = space();
    			p = element("p");
    			i = element("i");
    			t5 = text("Search");
    			if (if_block) if_block.c();
    			t6 = text(" in ");
    			t7 = text(/*region*/ ctx[1]);
    			t8 = space();
    			div0 = element("div");
    			t9 = text("searchstring: ");
    			t10 = text(/*searchstring*/ ctx[0]);
    			br1 = element("br");
    			t11 = text("\n  region: ");
    			t12 = text(/*region*/ ctx[1]);
    			br2 = element("br");
    			t13 = space();
    			div1 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			if (each1_else) {
    				each1_else.c();
    			}

    			attr_dev(h2, "class", "svelte-14hoyc1");
    			add_location(h2, file, 68, 0, 1798);
    			attr_dev(input, "class", "searchstring svelte-14hoyc1");
    			attr_dev(input, "placeholder", "Suche");
    			add_location(input, file, 70, 2, 1840);
    			add_location(br0, file, 73, 2, 1930);
    			attr_dev(form, "action", "");
    			add_location(form, file, 69, 0, 1821);
    			add_location(i, file, 83, 17, 2186);
    			attr_dev(p, "class", "debug svelte-14hoyc1");
    			add_location(p, file, 83, 0, 2169);
    			add_location(br1, file, 86, 30, 2313);
    			add_location(br2, file, 87, 18, 2336);
    			attr_dev(div0, "class", "debug svelte-14hoyc1");
    			add_location(div0, file, 85, 0, 2263);
    			attr_dev(div1, "class", "cards svelte-14hoyc1");
    			add_location(div1, file, 91, 0, 2403);
    		},
    		l: function claim(nodes) {
    			throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, form, anchor);
    			append_dev(form, input);
    			append_dev(form, t2);
    			append_dev(form, br0);
    			append_dev(form, t3);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(form, null);
    			}

    			insert_dev(target, t4, anchor);
    			insert_dev(target, p, anchor);
    			append_dev(p, i);
    			append_dev(i, t5);
    			if (if_block) if_block.m(i, null);
    			append_dev(i, t6);
    			append_dev(i, t7);
    			insert_dev(target, t8, anchor);
    			insert_dev(target, div0, anchor);
    			append_dev(div0, t9);
    			append_dev(div0, t10);
    			append_dev(div0, br1);
    			append_dev(div0, t11);
    			append_dev(div0, t12);
    			append_dev(div0, br2);
    			insert_dev(target, t13, anchor);
    			insert_dev(target, div1, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}

    			if (each1_else) {
    				each1_else.m(div1, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(input, "keyup", /*handleSearchstring*/ ctx[5], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*menuregions, region, handleClickRegion*/ 26) {
    				each_value_1 = /*menuregions*/ ctx[3];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(form, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (/*searchstring*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					if_block.m(i, t6);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (!current || dirty & /*region*/ 2) set_data_dev(t7, /*region*/ ctx[1]);
    			if (!current || dirty & /*searchstring*/ 1) set_data_dev(t10, /*searchstring*/ ctx[0]);
    			if (!current || dirty & /*region*/ 2) set_data_dev(t12, /*region*/ ctx[1]);

    			if (dirty & /*experts*/ 4) {
    				const each_value = /*experts*/ ctx[2];
    				validate_each_argument(each_value);
    				group_outros();
    				for (let i = 0; i < each_blocks.length; i += 1) each_blocks[i].r();
    				validate_each_keys(ctx, each_value, get_each_context, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each1_lookup, div1, fix_and_outro_and_destroy_block, create_each_block, null, get_each_context);
    				for (let i = 0; i < each_blocks.length; i += 1) each_blocks[i].a();
    				check_outros();

    				if (each_value.length) {
    					if (each1_else) {
    						each1_else.d(1);
    						each1_else = null;
    					}
    				} else if (!each1_else) {
    					each1_else = create_else_block(ctx);
    					each1_else.c();
    					each1_else.m(div1, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(form);
    			destroy_each(each_blocks_1, detaching);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(p);
    			if (if_block) if_block.d();
    			if (detaching) detach_dev(t8);
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t13);
    			if (detaching) detach_dev(div1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}

    			if (each1_else) each1_else.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("ExpertSearch", slots, []);
    	let searchstring = "";
    	let region = "Alle Regionen";

    	// TODO menuregions according values in backend index
    	let menuregions = [
    		"Alle Regionen",
    		"Zürich Stadt",
    		"Zürich Oberland",
    		"Zürich Unterland",
    		"Albis",
    		"Winterthur"
    	];

    	let apiURL =  "http://localhost:8080/Plone/";

    	apiURL = apiURL + "@search?portal_type=dexterity.membrane.member&fullobjects=1&sort_on=last_name&sort_order=ascending";
    	let searchUrl = "";
    	let experts = [];

    	function setSearchUrl(region = "Alle Regionen", searchstring = "") {
    		searchUrl = (region == "Alle Regionen"
    		? apiURL
    		: apiURL + "&region=" + encodeURI(region)) + (searchstring ? "&SearchableText=" + searchstring : "");
    	}

    	

    	async function getExperts(url = apiURL) {
    		fetch(url, {
    			method: "GET",
    			headers: {
    				"Content-Type": "application/json",
    				"Accept": "application/json"
    			}
    		}).then(response => {
    			if (!response.ok) {
    				throw new Error("Network response was not ok");
    			}

    			return response.json();
    		}).then(data => {
    			$$invalidate(2, experts = data?.items || []);
    			return experts;
    		}).catch(error => {
    			console.error("There has been a problem with your fetch operation:", error);
    		});
    	}

    	

    	onMount(() => {
    		getExperts();
    	});

    	const handleClickRegion = event => {
    		$$invalidate(1, region = event.target.value);
    		setSearchUrl(region, searchstring);
    		getExperts(searchUrl);
    	};

    	const handleSearchstring = event => {
    		$$invalidate(0, searchstring = event.target.value + (event.target.value ? "*" : ""));
    		setSearchUrl(region, searchstring);
    		getExperts(searchUrl);
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<ExpertSearch> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		scale,
    		flip,
    		searchstring,
    		region,
    		menuregions,
    		apiURL,
    		searchUrl,
    		experts,
    		setSearchUrl,
    		getExperts,
    		handleClickRegion,
    		handleSearchstring
    	});

    	$$self.$inject_state = $$props => {
    		if ("searchstring" in $$props) $$invalidate(0, searchstring = $$props.searchstring);
    		if ("region" in $$props) $$invalidate(1, region = $$props.region);
    		if ("menuregions" in $$props) $$invalidate(3, menuregions = $$props.menuregions);
    		if ("apiURL" in $$props) apiURL = $$props.apiURL;
    		if ("searchUrl" in $$props) searchUrl = $$props.searchUrl;
    		if ("experts" in $$props) $$invalidate(2, experts = $$props.experts);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		searchstring,
    		region,
    		experts,
    		menuregions,
    		handleClickRegion,
    		handleSearchstring
    	];
    }

    class ExpertSearch extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ExpertSearch",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.29.7 */
    const file$1 = "src/App.svelte";

    function create_fragment$1(ctx) {
    	let main;
    	let expertsearch;
    	let current;
    	expertsearch = new ExpertSearch({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(expertsearch.$$.fragment);
    			attr_dev(main, "class", "svelte-14zoht4");
    			add_location(main, file$1, 7, 0, 106);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(expertsearch, main, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(expertsearch.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(expertsearch.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(expertsearch);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);
    	let name = "my-svelte-app";
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ name, ExpertSearch });

    	$$self.$inject_state = $$props => {
    		if ("name" in $$props) name = $$props.name;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    let targets = document.getElementsByClassName("my-svelte-app");

    for(let i = 0;i < targets.length; i++){
        let target = targets[i];
        const app_instance = new App({
        target: target,
        props: {
        }
      });
    }

}());
//# sourceMappingURL=bundle.js.map
