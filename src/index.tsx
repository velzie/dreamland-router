let $activerouter: ThisParameterType<typeof Route> | null;
let $state: string[] = [];

export const Route: Component<{
  path: string
  show?: ComponentElement<any>
  regex?: boolean
  render: (root: HTMLElement) => void
  route: (path: string) => void
}, {
  _route: (path: string) => void
  children: ComponentElement<typeof Route>[] | ComponentElement<typeof Redirect>[]
}, "route" | "render"> = function() {
  return <div />;
}

Route.prototype.render = function(this: ThisParameterType<typeof Route>, root: HTMLElement) {
  $activerouter = this;
  root.appendChild(this.root);
  this.route(location.pathname);
  window.addEventListener('popstate', () => {
    this.route($state.pop()!);
  });
}

Route.prototype.route = function(this: ThisParameterType<typeof Route>, path: string) {
  let a = <a href={path}></a> as HTMLAnchorElement;
  let pathname = new URL(a.href).pathname;
  $state.push(pathname);
  history.pushState({}, "", pathname);
  if (pathname[pathname.length - 1] != "/")
    pathname += "/"
  this._route(pathname.replace(this.path, ""));
}
Route.prototype._route = function(this: ThisParameterType<typeof Route>, path: string) {
  if (this.children.length < 1) return;
  if (this.show?.$)
    this.show.$.outlet = "";
  a: for (const { $: route } of this.children) {
    let paths = path.split("/");
    let route_paths = route.path.split("/");

    // console.log(paths, route_paths);
    let len = route_paths.length;
    for (let i = 0; i < len; i++) {
      let routepath = route_paths.shift()!;
      let path = paths.shift()!;
      // console.log("testing,", routepath, path);
      if (route.regex) {
        let regex = new RegExp(routepath);
        if (!regex.test(path)) {
          continue a
        }
      } else {
        if (routepath.startsWith(":")) {
          let varname = routepath.slice(1);
          if (route.show)
            route.show.$[varname] = path;
        } else if (routepath != path) {
          continue a
        }
      }
    }
    // console.log("matched with", route.path, route_paths, paths);


    if (route instanceof Redirect) {
      // console.log("redirecting to", route.to);
      $activerouter!.route(route.to);
    } else {
      if (this.show?.$) {
        this.show.$.outlet = route.show;
      } else {
        let comp = route.show || route.root;

        this.root.replaceWith(comp);
        this.root = comp;
      }

      route['_route'](paths.join("/"));
    }
    return;
  }

  if (this.show?.$)
    this.show.$.outlet = "";
}

export const Redirect: Component<{
  path: string
  to: string
}, {}> = function() {
  return <div />;
}

export const Link: Component<{
  class?: any
  href: string
}, {
  children: any
}> = function() {
  this.class ??= "";
  return <a href={this.href} on:click={(e) => {
    e.preventDefault();
    e.stopImmediatePropagation();
    $activerouter?.route(this.href)
  }} class={this.class}>{this.children}</a>;
}
