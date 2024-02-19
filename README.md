# dreamland-router
Like react-router but for [dreamland.js](https://github.com/MercuryWorkshop/dreamlandjs)

example:
```js
export const router = (
  <Route path="/">
    <Route path="feed" show={<Home />}>
      <Route path="home" show={<Timeline kind="home" />} />
      <Route path="public" show={<Timeline kind="public?local=true" />} />
      <Route path="bubble" show={<Timeline kind="bubble" />} />
      <Route path="bookmarks" show={<Timeline kind="bookmarks" />} />
      <Redirect path="" to="/feed/home" />
    </Route>
    <Route path="notice">
      <Route path=":id" show={<Notice />} />
    </Route>
    <Route path="user">
      <Route path=":id" show={<User />} />
    </Route>
    <Route path="settings" show={<Settings />} />

    <Redirect path="" to="/feed" />
    <Route regex path=".*" show={<PageNotFound />} />
  </Route>
).$

router.render(document.querySelector('#app')!);
```
