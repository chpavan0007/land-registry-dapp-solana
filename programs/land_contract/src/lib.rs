use anchor_lang::prelude::*;

declare_id!("2vn6gxUJ4VJCDjxy9eMNHaSRs37VaP3Mt6MVfqxVHgKM");

#[program]
pub mod land_contract {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
