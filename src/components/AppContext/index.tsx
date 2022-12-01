import type { PropsWithChildren } from "react";
import React from "react";

import { IntlProvider } from "~/components/AppContext/I18n";
import Theme from "~/components/AppContext/Theme";

export function AppContext({ children }: PropsWithChildren) {
	return (
		<Theme>
			<IntlProvider>{children}</IntlProvider>
		</Theme>
	);
}
