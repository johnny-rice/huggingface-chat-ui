import { redirect } from "@sveltejs/kit";
import { getOIDCAuthorizationUrl } from "$lib/server/auth";
import { base } from "$app/paths";
import { config } from "$lib/server/config";

export const actions = {
	async default({ url, locals, request }) {
		const referer = request.headers.get("referer");
		let redirectURI = `${(referer ? new URL(referer) : url).origin}${base}/login/callback`;

		// TODO: Handle errors if provider is not responding

		if (url.searchParams.has("callback")) {
			const callback = url.searchParams.get("callback") || redirectURI;
			if (config.ALTERNATIVE_REDIRECT_URLS.includes(callback)) {
				redirectURI = callback;
			}
		}

		const authorizationUrl = await getOIDCAuthorizationUrl(
			{ redirectURI },
			{ sessionId: locals.sessionId }
		);

		redirect(303, authorizationUrl);
	},
};
