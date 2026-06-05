# Captured API output

Everything below is verbatim output from the Docker Compose stack: Strapi 4.26.2 on
Node 22, Postgres, `NODE_ENV=production`, seeded by `SEED_ON_BOOTSTRAP=true` and published
on port 8270. Nothing here is hand-written; regenerate it by bringing the stack up and
re-running the commands. Timestamps and upload hashes change on every fresh boot.

---

## `GET /api/home-page`

The deliverable the challenge brief asks for: 1 Header Block, 2 Two-Column Blocks and a
Carousel Block with three items, each with its media populated.

The `sections` dynamic zone is populated by default — see
`src/api/home-page/services/home-page.js`. Stock Strapi would return the entry with no
`sections` at all.

```console
$ curl -s http://localhost:8270/api/home-page | python3 -m json.tool
```

```json
{
    "data": {
        "id": 1,
        "attributes": {
            "createdAt": "2026-11-09T11:59:12.828Z",
            "updatedAt": "2026-11-09T11:59:12.828Z",
            "publishedAt": "2026-11-09T11:59:12.804Z",
            "sections": [
                {
                    "id": 1,
                    "__component": "common.header",
                    "Text": "Surgical video, peer reviewed.",
                    "ButtonText": "Browse the library",
                    "ButtonLink": "/library"
                },
                {
                    "id": 1,
                    "__component": "common.two-column-block",
                    "TitleText": "Filmed in theatre, narrated by the operating surgeon",
                    "Description": "Every article on JOMI is a full-length operation recorded from the surgeon\u2019s point of view, with the surgeon narrating the decisions as they are made \u2014 why this plane, why this instrument, what to do when the anatomy is not what the textbook promised.",
                    "ButtonText": "Watch a sample operation",
                    "ButtonUrl": "/library/laparoscopic-cholecystectomy",
                    "ImagePosition": "Right",
                    "Image": {
                        "data": {
                            "id": 1,
                            "attributes": {
                                "name": "operating-room.png",
                                "alternativeText": "Surgeons operating under theatre lights",
                                "caption": "Every procedure is filmed from the surgeon\u2019s point of view.",
                                "width": 900,
                                "height": 600,
                                "formats": {
                                    "small": {
                                        "ext": ".png",
                                        "url": "/uploads/small_operating_room_c8a9911fc8.png",
                                        "hash": "small_operating_room_c8a9911fc8",
                                        "mime": "image/png",
                                        "name": "small_operating-room.png",
                                        "path": null,
                                        "size": 182.6,
                                        "width": 500,
                                        "height": 333,
                                        "sizeInBytes": 182604
                                    },
                                    "medium": {
                                        "ext": ".png",
                                        "url": "/uploads/medium_operating_room_c8a9911fc8.png",
                                        "hash": "medium_operating_room_c8a9911fc8",
                                        "mime": "image/png",
                                        "name": "medium_operating-room.png",
                                        "path": null,
                                        "size": 439.67,
                                        "width": 750,
                                        "height": 500,
                                        "sizeInBytes": 439669
                                    },
                                    "thumbnail": {
                                        "ext": ".png",
                                        "url": "/uploads/thumbnail_operating_room_c8a9911fc8.png",
                                        "hash": "thumbnail_operating_room_c8a9911fc8",
                                        "mime": "image/png",
                                        "name": "thumbnail_operating-room.png",
                                        "path": null,
                                        "size": 42.16,
                                        "width": 234,
                                        "height": 156,
                                        "sizeInBytes": 42159
                                    }
                                },
                                "hash": "operating_room_c8a9911fc8",
                                "ext": ".png",
                                "mime": "image/png",
                                "size": 102.42,
                                "url": "/uploads/operating_room_c8a9911fc8.png",
                                "previewUrl": null,
                                "provider": "local",
                                "provider_metadata": null,
                                "createdAt": "2026-11-09T11:59:12.143Z",
                                "updatedAt": "2026-11-09T11:59:12.143Z"
                            }
                        }
                    }
                },
                {
                    "id": 2,
                    "__component": "common.two-column-block",
                    "TitleText": "Reviewed by surgeons before it is published",
                    "Description": "Each submission is reviewed by practising surgeons in the same speciality. Reviewers annotate the video itself rather than a manuscript about it, so the critique lands on the step it refers to and readers can see exactly what was questioned.",
                    "ButtonText": "How peer review works",
                    "ButtonUrl": "/about/peer-review",
                    "ImagePosition": "Left",
                    "Image": {
                        "data": {
                            "id": 2,
                            "attributes": {
                                "name": "peer-review.png",
                                "alternativeText": "A reviewer annotating a surgical video timeline",
                                "caption": "Each article is peer reviewed before publication.",
                                "width": 900,
                                "height": 600,
                                "formats": {
                                    "small": {
                                        "ext": ".png",
                                        "url": "/uploads/small_peer_review_228d5686c1.png",
                                        "hash": "small_peer_review_228d5686c1",
                                        "mime": "image/png",
                                        "name": "small_peer-review.png",
                                        "path": null,
                                        "size": 171.1,
                                        "width": 500,
                                        "height": 333,
                                        "sizeInBytes": 171099
                                    },
                                    "medium": {
                                        "ext": ".png",
                                        "url": "/uploads/medium_peer_review_228d5686c1.png",
                                        "hash": "medium_peer_review_228d5686c1",
                                        "mime": "image/png",
                                        "name": "medium_peer-review.png",
                                        "path": null,
                                        "size": 421.24,
                                        "width": 750,
                                        "height": 500,
                                        "sizeInBytes": 421244
                                    },
                                    "thumbnail": {
                                        "ext": ".png",
                                        "url": "/uploads/thumbnail_peer_review_228d5686c1.png",
                                        "hash": "thumbnail_peer_review_228d5686c1",
                                        "mime": "image/png",
                                        "name": "thumbnail_peer-review.png",
                                        "path": null,
                                        "size": 38.07,
                                        "width": 234,
                                        "height": 156,
                                        "sizeInBytes": 38071
                                    }
                                },
                                "hash": "peer_review_228d5686c1",
                                "ext": ".png",
                                "mime": "image/png",
                                "size": 98.94,
                                "url": "/uploads/peer_review_228d5686c1.png",
                                "previewUrl": null,
                                "provider": "local",
                                "provider_metadata": null,
                                "createdAt": "2026-11-09T11:59:12.302Z",
                                "updatedAt": "2026-11-09T11:59:12.302Z"
                            }
                        }
                    }
                },
                {
                    "id": 1,
                    "__component": "common.carousel",
                    "Item": [
                        {
                            "id": 3,
                            "TitleText": "Laparoscopic cholecystectomy",
                            "Description": "Critical view of safety demonstrated in full, including the dissection that establishes it and the point at which the surgeon would convert.",
                            "ButtonText": "Open the article",
                            "ButtonUrl": "/library/laparoscopic-cholecystectomy",
                            "ImagePosition": "Left",
                            "Image": {
                                "data": {
                                    "id": 3,
                                    "attributes": {
                                        "name": "laparoscopy.png",
                                        "alternativeText": "Laparoscopic instruments inside the abdominal cavity",
                                        "caption": "Laparoscopic cholecystectomy, step by step.",
                                        "width": 900,
                                        "height": 600,
                                        "formats": {
                                            "small": {
                                                "ext": ".png",
                                                "url": "/uploads/small_laparoscopy_ee95bff666.png",
                                                "hash": "small_laparoscopy_ee95bff666",
                                                "mime": "image/png",
                                                "name": "small_laparoscopy.png",
                                                "path": null,
                                                "size": 184.88,
                                                "width": 500,
                                                "height": 333,
                                                "sizeInBytes": 184877
                                            },
                                            "medium": {
                                                "ext": ".png",
                                                "url": "/uploads/medium_laparoscopy_ee95bff666.png",
                                                "hash": "medium_laparoscopy_ee95bff666",
                                                "mime": "image/png",
                                                "name": "medium_laparoscopy.png",
                                                "path": null,
                                                "size": 445.23,
                                                "width": 750,
                                                "height": 500,
                                                "sizeInBytes": 445229
                                            },
                                            "thumbnail": {
                                                "ext": ".png",
                                                "url": "/uploads/thumbnail_laparoscopy_ee95bff666.png",
                                                "hash": "thumbnail_laparoscopy_ee95bff666",
                                                "mime": "image/png",
                                                "name": "thumbnail_laparoscopy.png",
                                                "path": null,
                                                "size": 41.13,
                                                "width": 234,
                                                "height": 156,
                                                "sizeInBytes": 41125
                                            }
                                        },
                                        "hash": "laparoscopy_ee95bff666",
                                        "ext": ".png",
                                        "mime": "image/png",
                                        "size": 99.38,
                                        "url": "/uploads/laparoscopy_ee95bff666.png",
                                        "previewUrl": null,
                                        "provider": "local",
                                        "provider_metadata": null,
                                        "createdAt": "2026-11-09T11:59:12.462Z",
                                        "updatedAt": "2026-11-09T11:59:12.462Z"
                                    }
                                }
                            }
                        },
                        {
                            "id": 4,
                            "TitleText": "Knee arthroscopy with meniscal repair",
                            "Description": "Portal placement, diagnostic sweep and an inside-out repair, with the surgeon explaining when a tear is worth repairing rather than trimming.",
                            "ButtonText": "Open the article",
                            "ButtonUrl": "/library/knee-arthroscopy",
                            "ImagePosition": "Right",
                            "Image": {
                                "data": {
                                    "id": 4,
                                    "attributes": {
                                        "name": "orthopedics.png",
                                        "alternativeText": "An orthopaedic surgeon preparing a knee arthroscopy",
                                        "caption": "Knee arthroscopy with portal placement annotated.",
                                        "width": 900,
                                        "height": 600,
                                        "formats": {
                                            "small": {
                                                "ext": ".png",
                                                "url": "/uploads/small_orthopedics_6fcafa5932.png",
                                                "hash": "small_orthopedics_6fcafa5932",
                                                "mime": "image/png",
                                                "name": "small_orthopedics.png",
                                                "path": null,
                                                "size": 183.35,
                                                "width": 500,
                                                "height": 333,
                                                "sizeInBytes": 183353
                                            },
                                            "medium": {
                                                "ext": ".png",
                                                "url": "/uploads/medium_orthopedics_6fcafa5932.png",
                                                "hash": "medium_orthopedics_6fcafa5932",
                                                "mime": "image/png",
                                                "name": "medium_orthopedics.png",
                                                "path": null,
                                                "size": 442.29,
                                                "width": 750,
                                                "height": 500,
                                                "sizeInBytes": 442292
                                            },
                                            "thumbnail": {
                                                "ext": ".png",
                                                "url": "/uploads/thumbnail_orthopedics_6fcafa5932.png",
                                                "hash": "thumbnail_orthopedics_6fcafa5932",
                                                "mime": "image/png",
                                                "name": "thumbnail_orthopedics.png",
                                                "path": null,
                                                "size": 40.75,
                                                "width": 234,
                                                "height": 156,
                                                "sizeInBytes": 40747
                                            }
                                        },
                                        "hash": "orthopedics_6fcafa5932",
                                        "ext": ".png",
                                        "mime": "image/png",
                                        "size": 98.86,
                                        "url": "/uploads/orthopedics_6fcafa5932.png",
                                        "previewUrl": null,
                                        "provider": "local",
                                        "provider_metadata": null,
                                        "createdAt": "2026-11-09T11:59:12.629Z",
                                        "updatedAt": "2026-11-09T11:59:12.629Z"
                                    }
                                }
                            }
                        },
                        {
                            "id": 5,
                            "TitleText": "Teaching files for residents",
                            "Description": "Programmes use JOMI to prepare residents for cases they are about to scrub on: watch the operation, read the review, then step into theatre.",
                            "ButtonText": "For institutions",
                            "ButtonUrl": "/institutions",
                            "ImagePosition": "Left",
                            "Image": {
                                "data": {
                                    "id": 5,
                                    "attributes": {
                                        "name": "teaching.png",
                                        "alternativeText": "Residents reviewing an operation on a wall display",
                                        "caption": "Residents prepare for theatre by watching the case first.",
                                        "width": 900,
                                        "height": 600,
                                        "formats": {
                                            "small": {
                                                "ext": ".png",
                                                "url": "/uploads/small_teaching_dc8acd487d.png",
                                                "hash": "small_teaching_dc8acd487d",
                                                "mime": "image/png",
                                                "name": "small_teaching.png",
                                                "path": null,
                                                "size": 192.08,
                                                "width": 500,
                                                "height": 333,
                                                "sizeInBytes": 192082
                                            },
                                            "medium": {
                                                "ext": ".png",
                                                "url": "/uploads/medium_teaching_dc8acd487d.png",
                                                "hash": "medium_teaching_dc8acd487d",
                                                "mime": "image/png",
                                                "name": "medium_teaching.png",
                                                "path": null,
                                                "size": 470.34,
                                                "width": 750,
                                                "height": 500,
                                                "sizeInBytes": 470339
                                            },
                                            "thumbnail": {
                                                "ext": ".png",
                                                "url": "/uploads/thumbnail_teaching_dc8acd487d.png",
                                                "hash": "thumbnail_teaching_dc8acd487d",
                                                "mime": "image/png",
                                                "name": "thumbnail_teaching.png",
                                                "path": null,
                                                "size": 42.67,
                                                "width": 234,
                                                "height": 156,
                                                "sizeInBytes": 42670
                                            }
                                        },
                                        "hash": "teaching_dc8acd487d",
                                        "ext": ".png",
                                        "mime": "image/png",
                                        "size": 103.67,
                                        "url": "/uploads/teaching_dc8acd487d.png",
                                        "previewUrl": null,
                                        "provider": "local",
                                        "provider_metadata": null,
                                        "createdAt": "2026-11-09T11:59:12.798Z",
                                        "updatedAt": "2026-11-09T11:59:12.798Z"
                                    }
                                }
                            }
                        }
                    ]
                }
            ]
        }
    },
    "meta": {}
}
```

### Response headers

`global::http-cache` marks anonymous content reads as publicly cacheable. This request
was sent with `Origin: http://localhost:3000`; the cache middleware appends to the
`Vary` header CORS already set rather than replacing it.

```http
HTTP/1.1 200 OK
Content-Security-Policy: connect-src 'self' https:;img-src 'self' data: blob: https://market-assets.strapi.io;media-src 'self' data: blob:;default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline'
Referrer-Policy: no-referrer
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-DNS-Prefetch-Control: off
X-Download-Options: noopen
X-Frame-Options: SAMEORIGIN
X-Permitted-Cross-Domain-Policies: none
Vary: Origin, Accept-Encoding
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Credentials: true
Content-Type: application/json; charset=utf-8
X-Powered-By: Strapi <strapi.io>
Cache-Control: public, max-age=60, stale-while-revalidate=600
Content-Length: 8319
Date: Mon, 09 Nov 2026 12:00:34 GMT
Connection: close
```

### An explicit `?populate=` is left alone

A caller asking for less gets less: the blocks come back without their media, which is
the cheaper query it asked for.

```console
$ curl -s 'http://localhost:8270/api/home-page?populate[sections]=true' | python3 -m json.tool
```

```json
{
    "data": {
        "id": 1,
        "attributes": {
            "createdAt": "2026-11-09T11:59:12.828Z",
            "updatedAt": "2026-11-09T11:59:12.828Z",
            "publishedAt": "2026-11-09T11:59:12.804Z",
            "sections": [
                {
                    "id": 1,
                    "__component": "common.header",
                    "Text": "Surgical video, peer reviewed.",
                    "ButtonText": "Browse the library",
                    "ButtonLink": "/library"
                },
                {
                    "id": 1,
                    "__component": "common.two-column-block",
                    "TitleText": "Filmed in theatre, narrated by the operating surgeon",
                    "Description": "Every article on JOMI is a full-length operation recorded from the surgeon\u2019s point of view, with the surgeon narrating the decisions as they are made \u2014 why this plane, why this instrument, what to do when the anatomy is not what the textbook promised.",
                    "ButtonText": "Watch a sample operation",
                    "ButtonUrl": "/library/laparoscopic-cholecystectomy",
                    "ImagePosition": "Right"
                },
                {
                    "id": 2,
                    "__component": "common.two-column-block",
                    "TitleText": "Reviewed by surgeons before it is published",
                    "Description": "Each submission is reviewed by practising surgeons in the same speciality. Reviewers annotate the video itself rather than a manuscript about it, so the critique lands on the step it refers to and readers can see exactly what was questioned.",
                    "ButtonText": "How peer review works",
                    "ButtonUrl": "/about/peer-review",
                    "ImagePosition": "Left"
                },
                {
                    "id": 1,
                    "__component": "common.carousel"
                }
            ]
        }
    },
    "meta": {}
}
```

---

## `POST /graphql`

The front-end's committed operation, `graphql/cms/homepage.graphql` in
`jomi-challenge-frontend`, sent verbatim:

```graphql
query HomePage {
  homePage {
    data {
      attributes {
        sections {
          ... on ComponentCommonHeader {
            id
            Text
            ButtonText
            ButtonLink
          }
          ... on ComponentCommonCarousel {
            id
            Item {
              ... on ComponentCommonTwoColumnBlock {
                id
                TitleText
                Description
                ButtonText
                ButtonUrl
                ImagePosition
                Image {
                  data {
                    id
                    attributes {
                      url
                      previewUrl
                      alternativeText
                      width
                      height
                    }
                  }
                }
              }
            }
          }
          ... on ComponentCommonTwoColumnBlock {
            id
            TitleText
            Description
            ButtonText
            ButtonUrl
            ImagePosition
            Image {
              data {
                id
                attributes {
                  url
                  previewUrl
                  alternativeText
                  width
                  height
                }
              }
            }
          }
          ... on Error {
            code
            message
          }
        }
      }
    }
  }
}
```

```json
{
  "data": {
    "homePage": {
      "data": {
        "attributes": {
          "sections": [
            {
              "id": "1",
              "Text": "Surgical video, peer reviewed.",
              "ButtonText": "Browse the library",
              "ButtonLink": "/library"
            },
            {
              "id": "1",
              "TitleText": "Filmed in theatre, narrated by the operating surgeon",
              "Description": "Every article on JOMI is a full-length operation recorded from the surgeon\u2019s point of view, with the surgeon narrating the decisions as they are made \u2014 why this plane, why this instrument, what to do when the anatomy is not what the textbook promised.",
              "ButtonText": "Watch a sample operation",
              "ButtonUrl": "/library/laparoscopic-cholecystectomy",
              "ImagePosition": "Right",
              "Image": {
                "data": {
                  "id": "1",
                  "attributes": {
                    "url": "/uploads/operating_room_c8a9911fc8.png",
                    "previewUrl": null,
                    "alternativeText": "Surgeons operating under theatre lights",
                    "width": 900,
                    "height": 600
                  }
                }
              }
            },
            {
              "id": "2",
              "TitleText": "Reviewed by surgeons before it is published",
              "Description": "Each submission is reviewed by practising surgeons in the same speciality. Reviewers annotate the video itself rather than a manuscript about it, so the critique lands on the step it refers to and readers can see exactly what was questioned.",
              "ButtonText": "How peer review works",
              "ButtonUrl": "/about/peer-review",
              "ImagePosition": "Left",
              "Image": {
                "data": {
                  "id": "2",
                  "attributes": {
                    "url": "/uploads/peer_review_228d5686c1.png",
                    "previewUrl": null,
                    "alternativeText": "A reviewer annotating a surgical video timeline",
                    "width": 900,
                    "height": 600
                  }
                }
              }
            },
            {
              "id": "1",
              "Item": [
                {
                  "id": "3",
                  "TitleText": "Laparoscopic cholecystectomy",
                  "Description": "Critical view of safety demonstrated in full, including the dissection that establishes it and the point at which the surgeon would convert.",
                  "ButtonText": "Open the article",
                  "ButtonUrl": "/library/laparoscopic-cholecystectomy",
                  "ImagePosition": "Left",
                  "Image": {
                    "data": {
                      "id": "3",
                      "attributes": {
                        "url": "/uploads/laparoscopy_ee95bff666.png",
                        "previewUrl": null,
                        "alternativeText": "Laparoscopic instruments inside the abdominal cavity",
                        "width": 900,
                        "height": 600
                      }
                    }
                  }
                },
                {
                  "id": "4",
                  "TitleText": "Knee arthroscopy with meniscal repair",
                  "Description": "Portal placement, diagnostic sweep and an inside-out repair, with the surgeon explaining when a tear is worth repairing rather than trimming.",
                  "ButtonText": "Open the article",
                  "ButtonUrl": "/library/knee-arthroscopy",
                  "ImagePosition": "Right",
                  "Image": {
                    "data": {
                      "id": "4",
                      "attributes": {
                        "url": "/uploads/orthopedics_6fcafa5932.png",
                        "previewUrl": null,
                        "alternativeText": "An orthopaedic surgeon preparing a knee arthroscopy",
                        "width": 900,
                        "height": 600
                      }
                    }
                  }
                },
                {
                  "id": "5",
                  "TitleText": "Teaching files for residents",
                  "Description": "Programmes use JOMI to prepare residents for cases they are about to scrub on: watch the operation, read the review, then step into theatre.",
                  "ButtonText": "For institutions",
                  "ButtonUrl": "/institutions",
                  "ImagePosition": "Left",
                  "Image": {
                    "data": {
                      "id": "5",
                      "attributes": {
                        "url": "/uploads/teaching_dc8acd487d.png",
                        "previewUrl": null,
                        "alternativeText": "Residents reviewing an operation on a wall display",
                        "width": 900,
                        "height": 600
                      }
                    }
                  }
                }
              ]
            }
          ]
        }
      }
    }
  }
}
```

Note the absence of `__typename` in the payload: the document does not select it, and
Strapi only returns what is asked for. The front-end still branches on it because its
Apollo `InMemoryCache` adds `__typename` to every selection set by default.
`scripts/smoke.sh` therefore asks for it explicitly, which is what the `__typenames` line
in its output shows.

---

## `GET /api/content-pages`

```json
{
    "data": [
        {
            "id": 1,
            "attributes": {
                "slug": "about",
                "title": "About JOMI",
                "content": "## About\n\nJOMI is a peer-reviewed journal of surgical video. Articles are full-length operations, filmed in theatre and narrated by the operating surgeon.\n",
                "createdAt": "2026-11-09T11:59:12.857Z",
                "updatedAt": "2026-11-09T11:59:12.857Z",
                "publishedAt": "2026-11-09T11:59:12.854Z"
            }
        },
        {
            "id": 2,
            "attributes": {
                "slug": "peer-review",
                "title": "How peer review works",
                "content": "## Peer review\n\nReviewers annotate the video timeline directly. A submission is published once two reviewers in the same speciality sign off.\n",
                "createdAt": "2026-11-09T11:59:12.863Z",
                "updatedAt": "2026-11-09T11:59:12.863Z",
                "publishedAt": "2026-11-09T11:59:12.861Z"
            }
        },
        {
            "id": 3,
            "attributes": {
                "slug": "institutions",
                "title": "For institutions",
                "content": "## For institutions\n\nInstitutional subscriptions cover every resident and attending on a single sign-on, with usage reporting by department.\n",
                "createdAt": "2026-11-09T11:59:12.867Z",
                "updatedAt": "2026-11-09T11:59:12.867Z",
                "publishedAt": "2026-11-09T11:59:12.866Z"
            }
        }
    ],
    "meta": {
        "pagination": {
            "page": 1,
            "pageSize": 25,
            "pageCount": 1,
            "total": 3
        }
    }
}
```

---

## Query depth limit

`config/plugins.js` caps GraphQL selection-set depth at 12. The front-end's deepest real
query is 9; this one nests past the limit.

```console
$ curl -s -X POST http://localhost:8270/graphql -H 'Content-Type: application/json' \
    --data '{"query":"{ homePage { data { attributes { sections { ... on ComponentCommonCarousel { Item { Image { data { attributes { related { ... on ComponentCommonTwoColumnBlock { Image { data { attributes { related { __typename } } } } } } } } } } } } } } } }"}'
```

```json
{
  "errors": [
    {
      "message": "'' exceeds maximum operation depth of 12",
      "locations": [
        {
          "line": 1,
          "column": 200
        }
      ],
      "extensions": {
        "code": "GRAPHQL_VALIDATION_FAILED"
      }
    }
  ]
}
```
